"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LogIn, Terminal, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GlassButton } from "@/components/ui/GlassButton";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Systems" },
  { href: "#pricing",  label: "Protocols" },
  { href: "/blog",     label: "Intel" },
  { href: "#about",    label: "Origin" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-heavy shadow-lg shadow-purple-500/5 border-b border-white/10"
          : "bg-transparent"
      )}
    >
      {/* Top data strip */}
      <div className="hidden md:flex items-center justify-end px-6 py-0.5 border-b border-white/5 bg-purple-950/10">
        <div className="flex items-center gap-4 text-[10px] font-mono text-purple-400/70">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            SYS.ONLINE
          </span>
          <span className="opacity-50">|</span>
          <span>NEXUS·OS v2.6.1</span>
          <span className="opacity-50">|</span>
          <span>NODES: 2,847 ACTIVE</span>
        </div>
      </div>

      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-sm"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <span className="font-black text-base tracking-tight gradient-text">NEXUS</span>
              <div className="text-[8px] font-mono text-muted-foreground leading-none tracking-widest">
                NEURAL·OS
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Link
                  href={link.href}
                  className="relative px-3 py-1.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="text-purple-500/50 mr-0.5">_</span>
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <GlassButton variant="ghost-glass" size="sm">
                <LogIn className="w-3.5 h-3.5" />
                Access
              </GlassButton>
            </Link>
            <Link href="/signup">
              <GlassButton variant="gradient" size="sm" glow>
                Initialize
                <ArrowUpRight className="w-3.5 h-3.5" />
              </GlassButton>
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <GlassButton
              variant="ghost-glass"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </GlassButton>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-heavy border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-3 border-t border-white/10 mt-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <GlassButton variant="ghost-glass" className="w-full">Sign in</GlassButton>
                </Link>
                <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <GlassButton variant="gradient" className="w-full">Initialize</GlassButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
