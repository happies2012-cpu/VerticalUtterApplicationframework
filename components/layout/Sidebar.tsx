"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, MessageSquare, Users,
  Settings, User, Zap, LogOut, ChevronLeft, Menu,
  Newspaper, Activity, Terminal, Wifi,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GlassButton } from "@/components/ui/GlassButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { SafeUser } from "@/lib/types";

const links = [
  { href: "/dashboard",          label: "Command Center", icon: LayoutDashboard, tag: "OVERVIEW" },
  { href: "/dashboard/tasks",    label: "Task Matrix",    icon: CheckSquare,      tag: "CRUD" },
  { href: "/dashboard/chatbot",  label: "AI Core",        icon: MessageSquare,    tag: "NEURAL" },
  { href: "/dashboard/blog",     label: "Intel Feed",     icon: Newspaper,        tag: "DATA" },
  { href: "/dashboard/profile",  label: "Identity Node",  icon: User,             tag: "NODE" },
  { href: "/dashboard/settings", label: "System Config",  icon: Settings,         tag: "SYS" },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Root Access", icon: Users, tag: "ADMIN" },
];

export function Sidebar({ user }: { user: SafeUser }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const navItems = user.role === "admin" ? [...links, ...adminLinks] : links;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Session terminated");
    router.push("/");
    router.refresh();
  };

  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/8 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <motion.div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-sm flex-shrink-0"
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Zap className="w-4 h-4 text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="font-black text-sm gradient-text tracking-tight leading-none">NEXUS</div>
                <div className="text-[8px] font-mono text-muted-foreground tracking-widest leading-none">NEURAL·OS</div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        <GlassButton
          variant="ghost-glass"
          size="icon"
          className="hidden lg:flex w-7 h-7 rounded-lg"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform duration-300", collapsed && "rotate-180")} />
        </GlassButton>
      </div>

      {/* Status strip */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground/60">
            <Wifi className="w-2.5 h-2.5 text-green-400" />
            <span className="text-green-400">CONNECTED</span>
            <span className="opacity-40 mx-1">·</span>
            <span>NODE·ACTIVE</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {!collapsed && (
          <div className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest px-3 py-2">
            Navigation
          </div>
        )}
        {navItems.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-purple-600/20 to-pink-600/10 text-purple-400 border border-purple-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <link.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-purple-400" : "text-muted-foreground group-hover:text-foreground")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-between min-w-0"
                  >
                    <span className="truncate">{link.label}</span>
                    <span className={cn("text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded",
                      isActive ? "text-purple-400/70 bg-purple-500/10" : "text-muted-foreground/30"
                    )}>
                      {link.tag}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/8 space-y-1 flex-shrink-0">
        {!collapsed && (
          <div className="px-3 py-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{user.role}·node</div>
            </div>
          </div>
        )}

        <div className={cn("flex gap-1", collapsed ? "flex-col" : "flex-row")}>
          <ThemeToggle className="flex-1" />
          <GlassButton
            variant="ghost-glass"
            size={collapsed ? "icon" : "sm"}
            className="flex-1 text-destructive hover:text-destructive hover:border-destructive/30"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Terminate</span>}
          </GlassButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <GlassButton
        variant="ghost-glass"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="w-4 h-4" />
      </GlassButton>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed lg:sticky top-0 h-screen glass-heavy border-r border-white/8 z-50 flex flex-col overflow-hidden flex-shrink-0 transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarInner />
      </motion.aside>
    </>
  );
}
