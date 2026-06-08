"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "heavy" | "subtle" | "neon" | "dark";
  glow?: boolean;
  glowColor?: "purple" | "pink" | "cyan" | "green";
  scanlines?: boolean;
  hover?: boolean;
}

const glowColors = {
  purple: "hover:shadow-[0_0_40px_rgba(139,92,246,0.35),0_0_80px_rgba(139,92,246,0.1)]",
  pink:   "hover:shadow-[0_0_40px_rgba(236,72,153,0.35),0_0_80px_rgba(236,72,153,0.1)]",
  cyan:   "hover:shadow-[0_0_40px_rgba(6,182,212,0.35),0_0_80px_rgba(6,182,212,0.1)]",
  green:  "hover:shadow-[0_0_40px_rgba(16,185,129,0.35),0_0_80px_rgba(16,185,129,0.1)]",
};

const variants = {
  default: "glass-card rounded-2xl",
  heavy:   "glass-heavy rounded-2xl",
  subtle:  "glass-sm rounded-2xl",
  neon:    "glass-card rounded-2xl border-neon animate-cyber-pulse",
  dark:    "bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = "default",
      glow = false,
      glowColor = "purple",
      scanlines = false,
      hover = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref as any}
        className={cn(
          variants[variant],
          glow && glowColors[glowColor],
          scanlines && "relative scanlines overflow-hidden",
          hover && "transition-all duration-300",
          className
        )}
        whileHover={hover ? { y: -3, scale: 1.01 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

/* ── Stat card convenience wrapper ── */
export function GlassStatCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ElementType;
  gradient?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard className="p-6 group cursor-default" glowColor="purple">
        <div className="flex items-start justify-between mb-4">
          {Icon && (
            <div
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                gradient ||
                  "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20"
              )}
            >
              <Icon className="w-5 h-5 text-purple-400" />
            </div>
          )}
          {sub && (
            <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
              {sub}
            </span>
          )}
        </div>
        <div className="text-3xl font-black tracking-tight mb-1">{value}</div>
        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
          {label}
        </div>
      </GlassCard>
    </motion.div>
  );
}
