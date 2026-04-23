# Nexus Platform

A production-ready, full-stack SaaS platform built with Next.js 15, TypeScript, and Tailwind CSS. Features a stunning landing page, complete authentication system, dashboard with analytics, AI chatbot, task management, and admin panel.

## ✨ Features

### 🎨 Frontend
- **Stunning Landing Page** with hero, features, testimonials, pricing, and CTA sections
- **Glassmorphism UI** with gradient backgrounds and smooth animations
- **Dark + Light Mode** with system preference detection and manual toggle (persists in localStorage)
- **Fully Responsive** — mobile, tablet, and desktop optimized
- **Framer Motion** animations and micro-interactions throughout
- **Beautiful auth pages** (login, signup, forgot password)

### 🔐 Authentication & Authorization
- **JWT-based authentication** with HTTP-only cookies
- **Bcrypt password hashing** for security
- **Role-based access control (RBAC)** — Admin, Manager, User roles
- **Protected routes** with automatic redirects
- **Three demo accounts** ready to use

### 📊 Dashboard
- **Analytics overview** with charts (Recharts) and stats cards
- **Task management** with full CRUD, filtering, and search
- **AI Chatbot** with contextual responses
- **Profile management** with bio editing
- **Settings page** with theme, notifications, and security
- **Admin panel** (admin role only) for user oversight
- **Blog & Resources** section

### 🛠 Backend
- **Next.js API Routes** for all backend logic
- **Zod validation** on every endpoint
- **JSON-based persistence** (zero external DB setup needed)
- **Secure cookie-based sessions**

## 🚀 Getting Started

### Demo Accounts
After the app starts, log in with any of these:

| Role    | Email             | Password    |
|---------|-------------------|-------------|
| Admin   | admin@nexus.com   | Admin@123   |
| Manager | manager@nexus.com | Manager@123 |
| User    | user@nexus.com    | User@123    |

### Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5000`

### Production Build
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
.
├── app/
│   ├── api/                  # Backend API routes
│   │   ├── auth/             # login, signup, logout, me
│   │   ├── tasks/            # Task CRUD
│   │   ├── chat/             # AI chatbot
│   │   └── users/            # User management
│   ├── dashboard/            # Protected dashboard pages
│   │   ├── tasks/
│   │   ├── chatbot/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── admin/
│   │   └── blog/
│   ├── login/                # Auth pages
│   ├── signup/
│   ├── forgot-password/
│   ├── blog/                 # Public blog
│   ├── contact/              # Contact form
│   ├── page.tsx              # Landing page
│   └── layout.tsx
├── components/
│   ├── ui/                   # Reusable UI primitives
│   ├── layout/               # Navbar, Sidebar, Footer
│   ├── dashboard/            # Dashboard-specific components
│   └── chatbot/              # AI chatbot UI
├── lib/
│   ├── auth.ts               # JWT auth helpers
│   ├── db.ts                 # JSON file database
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
└── data/                     # Auto-generated JSON storage
```

## 🌐 Deployment

This app is ready to deploy on:
- **Replit**: Click the Publish button
- **Vercel**: `vercel --prod`
- **Any Node host**: `npm run build && npm start`

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + custom CSS variables
- **UI Primitives**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Auth**: JWT + bcryptjs
- **Theming**: next-themes
- **Notifications**: Sonner

## 📝 Environment Variables

Optional `.env.local`:
```
JWT_SECRET=your-super-secret-key-here
```
A safe default is provided for local development.

---

Built with ❤️ for modern teams.
