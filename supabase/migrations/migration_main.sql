-- ============================================================
-- Nexus Platform — Production PostgreSQL Schema
-- Target: Supabase Cloud (PostgreSQL 15+)
-- Run via: supabase db push  OR  psql $DATABASE_URL -f migration_main.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ── Enums ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role      AS ENUM ('admin', 'manager', 'user');
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status    AS ENUM ('todo', 'in_progress', 'done');
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_priority  AS ENUM ('low', 'medium', 'high');
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT          NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email       CITEXT        NOT NULL UNIQUE CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  password    TEXT          NOT NULL,                 -- bcrypt hash, never plaintext
  role        user_role     NOT NULL DEFAULT 'user',
  avatar      TEXT,                                   -- URL or null
  bio         TEXT          CHECK (char_length(bio) <= 500),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role   ON users (role);

-- ── tasks ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT          NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  description TEXT          NOT NULL DEFAULT '',
  status      task_status   NOT NULL DEFAULT 'todo',
  priority    task_priority NOT NULL DEFAULT 'medium',
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  due_date    DATE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id  ON tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);

-- ── blog_posts ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT          NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  slug         TEXT          NOT NULL UNIQUE,
  excerpt      TEXT          NOT NULL DEFAULT '',
  content      TEXT          NOT NULL DEFAULT '',
  category     TEXT          NOT NULL DEFAULT 'General',
  tags         TEXT[]        NOT NULL DEFAULT '{}',
  author       TEXT          NOT NULL,
  read_time    INTEGER       NOT NULL DEFAULT 5 CHECK (read_time > 0),
  featured     BOOLEAN       NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug      ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category  ON blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured  ON blog_posts (featured);

-- ── sessions (optional — for server-side session tracking) ─
CREATE TABLE IF NOT EXISTS sessions (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT          NOT NULL UNIQUE,          -- SHA-256 of the JWT jti
  user_agent  TEXT,
  ip_address  INET,
  expires_at  TIMESTAMPTZ   NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions (token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

-- ── updated_at auto-trigger ────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at     ON users;
DROP TRIGGER IF EXISTS trg_tasks_updated_at     ON tasks;
DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row-Level Security (Supabase / PostgREST) ─────────────
ALTER TABLE users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions   ENABLE ROW LEVEL SECURITY;

-- users: operators can read/update their own row; admins bypass
CREATE POLICY users_select_own ON users
  FOR SELECT USING (id = auth.uid() OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (id = auth.uid());

-- tasks: operators CRUD their own tasks; admins see all
CREATE POLICY tasks_select ON tasks
  FOR SELECT USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','manager')
    )
  );

CREATE POLICY tasks_insert ON tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY tasks_update ON tasks
  FOR UPDATE USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','manager')
    )
  );

CREATE POLICY tasks_delete ON tasks
  FOR DELETE USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- blog_posts: public read, admin write
CREATE POLICY blog_posts_select ON blog_posts
  FOR SELECT USING (TRUE);

CREATE POLICY blog_posts_modify ON blog_posts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- sessions: own rows only
CREATE POLICY sessions_own ON sessions
  FOR ALL USING (user_id = auth.uid());

-- ── Seed data (demo accounts, remove before prod) ─────────
-- Passwords are bcrypt hashes of: Admin@123 / Manager@123 / User@123
INSERT INTO users (id, name, email, password, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin User',    'admin@nexus.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Manager User',  'manager@nexus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
  ('00000000-0000-0000-0000-000000000003', 'Standard User', 'user@nexus.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user')
ON CONFLICT (email) DO NOTHING;

-- NOTE: Replace the bcrypt hashes above with properly hashed values
-- using: node -e "const b=require('bcryptjs');console.log(b.hashSync('Admin@123',10))"

-- ============================================================
-- SUPABASE ENVIRONMENT SETUP NOTES
-- ============================================================
-- 1. NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
-- 2. NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
-- 3. SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
-- 4. DATABASE_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require
-- 5. DIRECT_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres (for migrations)
-- Add connection pooling via Supabase's built-in pgBouncer:
-- DATABASE_URL=...supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
-- ============================================================
