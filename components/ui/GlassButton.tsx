"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: "glass" | "gradient" | "neon" | "ghost-glass" | "danger";
  size?: "sm" | "default" | "lg" | "xl" | "icon";
  glow?: boolean;
  pulse?: boolean;
  loading?: boolean;
}

const variantClasses = {
  glass:
    "glass text-foreground hover:bg-white/20 dark:hover:bg-white/10 active:scale-95",
  gradient:
    "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-600 text-white hover:from-purple-500 hover:via-fuchsia-400 hover:to-pink-500 active:scale-95 shadow-lg",
  neon:
    "bg-transparent border border-purple-500/60 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95",
  "ghost-glass":
    "bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 active:scale-95",
  danger:
    "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 active:scale-95",
};

const sizeClasses = {
  sm:      "h-8 px-3 text-xs rounded-lg gap-1.5",
  default: "h-10 px-4 text-sm rounded-xl gap-2",
  lg:      "h-12 px-6 text-sm rounded-xl gap-2",
  xl:      "h-14 px-8 text-base rounded-2xl gap-3",
  icon:    "h-10 w-10 rounded-xl",
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = "glass",
      size = "default",
      glow = false,
      pulse = false,
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref as any}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none select-none",
          variantClasses[variant],
          sizeClasses[size],
          glow && "glow",
          pulse && "animate-pulse-ring",
          className
        )}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Processing…</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
