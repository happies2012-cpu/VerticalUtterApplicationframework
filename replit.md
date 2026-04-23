# Nexus Platform

## Overview
A production-ready full-stack Next.js 15 SaaS web application featuring:
- Stunning landing page with glassmorphism and animations
- Full JWT authentication with role-based access control
- Dashboard with analytics, charts, and task management
- AI chatbot, profile/settings, admin panel
- Dark/light mode with system detection

## Architecture
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Radix UI primitives
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Auth**: JWT (jsonwebtoken) + bcryptjs, HTTP-only cookies
- **Persistence**: JSON files in `/data` (auto-seeded)
- **Theming**: next-themes

## Workflow
- `Start application` runs `npm run dev` on port 5000

## Demo Accounts
- admin@nexus.com / Admin@123
- manager@nexus.com / Manager@123
- user@nexus.com / User@123

## Project Structure
- `app/` — Next.js App Router pages and API routes
- `components/` — UI primitives, layout, dashboard, chatbot
- `lib/` — auth, db, types, utils
- `data/` — runtime JSON storage (gitignored)

## User Preferences
None recorded yet.
