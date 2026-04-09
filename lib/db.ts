import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { User, Task, BlogPost } from "./types";
import { generateId } from "./utils";
import bcrypt from "bcryptjs";

const DB_PATH = join(process.cwd(), "data");
const USERS_FILE = join(DB_PATH, "users.json");
const TASKS_FILE = join(DB_PATH, "tasks.json");
const POSTS_FILE = join(DB_PATH, "posts.json");

function ensureDir() {
  const { mkdirSync } = require("fs");
  if (!existsSync(DB_PATH)) {
    mkdirSync(DB_PATH, { recursive: true });
  }
}

function readFile<T>(path: string, defaultVal: T): T {
  ensureDir();
  if (!existsSync(path)) return defaultVal;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return defaultVal;
  }
}

function writeFile<T>(path: string, data: T): void {
  ensureDir();
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

export function getUsers(): User[] {
  const users = readFile<User[]>(USERS_FILE, []);
  if (users.length === 0) {
    const defaultUsers: User[] = [
      {
        id: generateId(),
        name: "Admin User",
        email: "admin@nexus.com",
        password: bcrypt.hashSync("Admin@123", 10),
        role: "admin",
        bio: "Platform administrator with full access.",
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: "Jane Manager",
        email: "manager@nexus.com",
        password: bcrypt.hashSync("Manager@123", 10),
        role: "manager",
        bio: "Team manager overseeing projects.",
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: "John User",
        email: "user@nexus.com",
        password: bcrypt.hashSync("User@123", 10),
        role: "user",
        bio: "Regular platform user.",
        createdAt: new Date().toISOString(),
      },
    ];
    writeFile(USERS_FILE, defaultUsers);
    return defaultUsers;
  }
  return users;
}

export function saveUsers(users: User[]): void {
  writeFile(USERS_FILE, users);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const users = getUsers();
  const user: User = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  return users[idx];
}

export function getTasks(userId?: string): Task[] {
  const tasks = readFile<Task[]>(TASKS_FILE, []);
  return userId ? tasks.filter((t) => t.userId === userId) : tasks;
}

export function saveTasks(tasks: Task[]): void {
  writeFile(TASKS_FILE, tasks);
}

export function createTask(data: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
  const tasks = getTasks();
  const now = new Date().toISOString();
  const task: Task = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(id: string, data: Partial<Task>): Task | null {
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...data, updatedAt: new Date().toISOString() };
  saveTasks(tasks);
  return tasks[idx];
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveTasks(filtered);
  return true;
}

export function getBlogPosts(): BlogPost[] {
  const posts = readFile<BlogPost[]>(POSTS_FILE, []);
  if (posts.length === 0) {
    const defaultPosts: BlogPost[] = [
      {
        id: generateId(),
        title: "Getting Started with Nexus Platform",
        excerpt: "Learn how to set up your workspace and start collaborating with your team effectively.",
        content: "Full content here...",
        category: "Getting Started",
        tags: ["tutorial", "beginner", "setup"],
        author: "Admin User",
        publishedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        readTime: 5,
        featured: true,
      },
      {
        id: generateId(),
        title: "Advanced Task Management Tips",
        excerpt: "Discover powerful strategies to manage complex projects and keep your team on track.",
        content: "Full content here...",
        category: "Productivity",
        tags: ["productivity", "tasks", "management"],
        author: "Jane Manager",
        publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        readTime: 8,
        featured: false,
      },
      {
        id: generateId(),
        title: "Integrating AI into Your Workflow",
        excerpt: "How to leverage our AI chatbot assistant to automate repetitive tasks and boost productivity.",
        content: "Full content here...",
        category: "AI & Automation",
        tags: ["ai", "automation", "chatbot"],
        author: "Admin User",
        publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        readTime: 6,
        featured: true,
      },
    ];
    writeFile(POSTS_FILE, defaultPosts);
    return defaultPosts;
  }
  return posts;
}
