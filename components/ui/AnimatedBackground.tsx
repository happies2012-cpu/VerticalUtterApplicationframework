"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Orb {
  id: number;
  x: string;
  y: string;
  size: string;
  color: string;
  delay: number;
  duration: number;
}

const ORBS: Orb[] = [
  { id: 1, x: "-10%",  y: "10%",  size: "600px", color: "rgba(139,92,246,0.18)",  delay: 0,  duration: 18 },
  { id: 2, x: "70%",   y: "-5%",  size: "500px", color: "rgba(236,72,153,0.14)",  delay: 3,  duration: 22 },
  { id: 3, x: "30%",   y: "60%",  size: "700px", color: "rgba(59,130,246,0.12)",  delay: 6,  duration: 26 },
  { id: 4, x: "80%",   y: "70%",  size: "450px", color: "rgba(16,185,129,0.10)",  delay: 2,  duration: 20 },
  { id: 5, x: "50%",   y: "30%",  size: "350px", color: "rgba(245,158,11,0.08)",  delay: 8,  duration: 24 },
];

const DARK_ORBS: Orb[] = [
  { id: 1, x: "-10%",  y: "10%",  size: "700px", color: "rgba(139,92,246,0.28)",  delay: 0,  duration: 18 },
  { id: 2, x: "70%",   y: "-5%",  size: "550px", color: "rgba(236,72,153,0.22)",  delay: 3,  duration: 22 },
  { id: 3, x: "20%",   y: "65%",  size: "650px", color: "rgba(59,130,246,0.18)",  delay: 6,  duration: 26 },
  { id: 4, x: "85%",   y: "75%",  size: "500px", color: "rgba(16,185,129,0.15)",  delay: 2,  duration: 20 },
  { id: 5, x: "50%",   y: "35%",  size: "380px", color: "rgba(245,158,11,0.12)",  delay: 8,  duration: 24 },
];

function OrbEl({ orb }: { orb: Orb }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: orb.x,
        top: orb.y,
        width: orb.size,
        height: orb.size,
        borderRadius: "50%",
        background: orb.color,
        filter: "blur(80px)",
        transform: "translate(-50%, -50%)",
        willChange: "transform",
      }}
      animate={{
        x: [0, 40, -20, 30, 0],
        y: [0, -30, 40, -10, 0],
        scale: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{
        duration: orb.duration,
        delay: orb.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function AnimatedBackground({ dark = false }: { dark?: boolean }) {
  const orbs = dark ? DARK_ORBS : ORBS;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {orbs.map((orb) => (
        <OrbEl key={orb.id} orb={orb} />
      ))}
    </div>
  );
}

/* ── Mini inline version for sections ── */
export function SectionGlow({
  color = "purple",
  size = "lg",
  className = "",
}: {
  color?: "purple" | "pink" | "blue" | "cyan";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const colors = {
    purple: "rgba(139,92,246,0.25)",
    pink:   "rgba(236,72,153,0.22)",
    blue:   "rgba(59,130,246,0.20)",
    cyan:   "rgba(6,182,212,0.18)",
  };
  const sizes = { sm: "300px", md: "500px", lg: "700px" };

  return (
    <div
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: sizes[size],
        height: sizes[size],
        borderRadius: "50%",
        background: colors[color],
        filter: "blur(100px)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
