"use client";

import { motion } from "framer-motion";
import {
  Users, CheckSquare, Activity, Crown, Shield,
  User as UserIcon, Zap, Database, Terminal,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { SafeUser, Task } from "@/lib/types";

const roleConfig = {
  admin:   { icon: Crown,    cls: "text-orange-400 border-orange-500/30 bg-orange-500/10",  label: "ROOT" },
  manager: { icon: Shield,   cls: "text-blue-400 border-blue-500/30 bg-blue-500/10",        label: "MGMT" },
  user:    { icon: UserIcon, cls: "text-green-400 border-green-500/30 bg-green-500/10",     label: "USER" },
};

export function AdminClient({ users, tasks }: { users: SafeUser[]; tasks: Task[] }) {
  const completionRate = tasks.length > 0
    ? Math.round(tasks.filter((t) => t.status === "done").length / tasks.length * 100)
    : 0;

  const stats = [
    { label: "Operator Nodes",  value: users.length,                                           icon: Users,       grad: "from-purple-500 to-pink-500",    sub: "TOTAL" },
    { label: "Operations",      value: tasks.length,                                           icon: CheckSquare, grad: "from-blue-500 to-cyan-500",      sub: "TOTAL" },
    { label: "Completion Rate", value: `${completionRate}%`,                                   icon: Activity,    grad: "from-green-500 to-emerald-500",  sub: "RATE" },
    { label: "Root Nodes",      value: users.filter((u) => u.role === "admin").length,          icon: Crown,       grad: "from-orange-500 to-red-500",     sub: "ADMIN" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">ROOT·ACCESS·PANEL</div>
        <h1 className="text-3xl font-black tracking-tight">Admin Control</h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          <span className="text-green-400">●</span> NEURAL·MESH · {users.length} nodes · {tasks.length} ops
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5 group cursor-default" glowColor="purple">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/50 bg-muted/50 px-2 py-1 rounded-full">{s.sub}</span>
              </div>
              <div className="text-3xl font-black tracking-tight">{s.value}</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-1">{s.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Users table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">OPERATOR·REGISTRY</div>
              <h3 className="font-black text-base">All nodes</h3>
            </div>
            <span className="text-[9px] font-mono text-green-400/70 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              {users.length} ONLINE
            </span>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["OPERATOR", "CLEARANCE", "NODE·ACTIVE", "OPERATIONS"].map((h) => (
                    <th key={h} className="text-left pb-3 text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const rc = roleConfig[u.role];
                  const Icon = rc.icon;
                  const userTasks = tasks.filter((t) => t.userId === u.id).length;
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{u.name}</div>
                            <div className="text-[10px] font-mono text-muted-foreground/60">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-mono px-2 py-1 rounded border ${rc.cls}`}>
                          <Icon className="w-3 h-3" />
                          {rc.label}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[10px] font-mono text-muted-foreground">{formatDate(u.createdAt).toUpperCase()}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted/50 max-w-[80px] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${Math.min((userTasks / Math.max(tasks.length / users.length * 2, 1)) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-bold">{userTasks}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* System status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard className="p-6" variant="neon">
          <div className="mb-4">
            <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">SYSTEM·TELEMETRY</div>
            <h3 className="font-black text-base">Platform status</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Auth System",    status: "NOMINAL", color: "text-green-400",  bg: "bg-green-500" },
              { label: "Storage Matrix", status: "NOMINAL", color: "text-green-400",  bg: "bg-green-500" },
              { label: "AI Core",        status: "NOMINAL", color: "text-green-400",  bg: "bg-green-500" },
            ].map(({ label, status, color, bg }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className={`w-2 h-2 rounded-full ${bg} animate-pulse flex-shrink-0`} />
                <div>
                  <div className="text-xs font-semibold">{label}</div>
                  <div className={`text-[9px] font-mono ${color}`}>{status}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
