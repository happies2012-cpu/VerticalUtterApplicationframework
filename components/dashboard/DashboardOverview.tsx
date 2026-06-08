"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckSquare, Clock, TrendingUp, Activity, ArrowUpRight,
  Sparkles, Terminal, Zap, Target, Cpu,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid,
  XAxis, YAxis, Tooltip, BarChart, Bar, Cell,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { SafeUser, Task } from "@/lib/types";

const chartData = [
  { name: "MON", tasks: 4,  completed: 2 },
  { name: "TUE", tasks: 7,  completed: 5 },
  { name: "WED", tasks: 5,  completed: 3 },
  { name: "THU", tasks: 9,  completed: 6 },
  { name: "FRI", tasks: 8,  completed: 7 },
  { name: "SAT", tasks: 3,  completed: 3 },
  { name: "SUN", tasks: 2,  completed: 1 },
];

const priorityData = [
  { name: "CRIT", value: 8,  color: "#ef4444" },
  { name: "MED",  value: 12, color: "#a855f7" },
  { name: "LOW",  value: 5,  color: "#10b981" },
];

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 rounded-xl text-xs font-mono">
      <div className="text-muted-foreground mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.stroke }} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.stroke }} />
          {p.name}: <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function DashboardOverview({ user, tasks, stats }: {
  user: SafeUser;
  tasks: Task[];
  stats: { total: number; completed: number; inProgress: number; todo: number };
}) {
  const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    { label: "Total Operations", value: stats.total,     sub: "+12%",   icon: Target,       grad: "from-purple-500 to-fuchsia-500" },
    { label: "Completed",        value: stats.completed, sub: `${rate}%`, icon: TrendingUp,  grad: "from-green-500 to-emerald-400" },
    { label: "In Progress",      value: stats.inProgress,sub: "ACTIVE", icon: Activity,     grad: "from-blue-500 to-cyan-400" },
    { label: "Queued",           value: stats.todo,      sub: "PENDING",icon: Clock,        grad: "from-orange-500 to-amber-400" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <FadeCard>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 p-8">
          {/* Decorative grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span className="text-xs font-mono text-purple-200/80 uppercase tracking-widest">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                System online,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                  {user.name.split(" ")[0]}.
                </span>
              </h1>
              <p className="text-purple-200/70 text-sm font-light">
                {stats.todo} operations queued · {stats.inProgress} nodes active · {rate}% throughput
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link href="/dashboard/chatbot">
                <GlassButton variant="glass" size="sm" className="border-white/30 text-white hover:bg-white/20">
                  <Cpu className="w-4 h-4" />
                  AI Core
                </GlassButton>
              </Link>
              <Link href="/dashboard/tasks">
                <GlassButton variant="gradient" size="sm">
                  New Operation
                  <ArrowUpRight className="w-4 h-4" />
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </FadeCard>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <FadeCard key={card.label} delay={0.08 * i}>
            <GlassCard className="p-5 group cursor-default" glowColor="purple">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.grad} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded-full">
                  {card.sub}
                </span>
              </div>
              <div className="text-3xl font-black tracking-tight">{card.value}</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-1">
                {card.label}
              </div>
            </GlassCard>
          </FadeCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <FadeCard delay={0.2}>
          <GlassCard className="lg:col-span-2 p-6" style={{ gridColumn: "span 2" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">TELEMETRY</div>
                <h3 className="font-black text-base">Weekly Activity Matrix</h3>
              </div>
              <span className="text-[9px] font-mono text-purple-400/70 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-full">
                LIVE·FEED
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tasks"     name="total"     stroke="#a855f7" fill="url(#gradPurple)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="completed" name="completed" stroke="#ec4899" fill="url(#gradPink)"   strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </FadeCard>

        <FadeCard delay={0.25}>
          <GlassCard className="p-6">
            <div className="mb-5">
              <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">TRIAGE</div>
              <h3 className="font-black text-base">Priority Index</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityData} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </FadeCard>
      </div>

      {/* Recent tasks */}
      <FadeCard delay={0.3}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">QUEUE</div>
              <h3 className="font-black text-base">Recent Operations</h3>
            </div>
            <Link href="/dashboard/tasks">
              <GlassButton variant="neon" size="sm">
                View All
                <ArrowUpRight className="w-3 h-3" />
              </GlassButton>
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Terminal className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-mono text-muted-foreground/60">NO·OPERATIONS·QUEUED</p>
              <p className="text-xs text-muted-foreground/40 mt-1 mb-4">Initialize your first task to begin</p>
              <Link href="/dashboard/tasks">
                <GlassButton variant="gradient">Initialize Operation</GlassButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-1.5">
              {tasks.slice(0, 5).map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.priority === "high" ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                      : task.priority === "medium" ? "bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.5)]"
                      : "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]"
                    }`} />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{task.title}</div>
                      <div className="text-[9px] font-mono text-muted-foreground/50 uppercase">{formatRelativeTime(task.createdAt)}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-1 rounded-full border flex-shrink-0 ${
                    task.status === "done"
                      ? "text-green-400 border-green-500/30 bg-green-500/10"
                      : task.status === "in_progress"
                      ? "text-blue-400 border-blue-500/30 bg-blue-500/10"
                      : "text-muted-foreground border-border/50 bg-muted/30"
                  }`}>
                    {task.status === "done" ? "COMPLETE" : task.status === "in_progress" ? "ACTIVE" : "QUEUED"}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </FadeCard>
    </div>
  );
}
