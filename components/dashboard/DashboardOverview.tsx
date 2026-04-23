"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  TrendingUp,
  Users,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { SafeUser, Task } from "@/lib/types";

const chartData = [
  { name: "Mon", tasks: 4, completed: 2 },
  { name: "Tue", tasks: 7, completed: 5 },
  { name: "Wed", tasks: 5, completed: 3 },
  { name: "Thu", tasks: 9, completed: 6 },
  { name: "Fri", tasks: 8, completed: 7 },
  { name: "Sat", tasks: 3, completed: 3 },
  { name: "Sun", tasks: 2, completed: 1 },
];

const priorityData = [
  { name: "High", value: 8, color: "#ef4444" },
  { name: "Medium", value: 12, color: "#f59e0b" },
  { name: "Low", value: 5, color: "#10b981" },
];

export function DashboardOverview({
  user,
  tasks,
  stats,
}: {
  user: SafeUser;
  tasks: Task[];
  stats: { total: number; completed: number; inProgress: number; todo: number };
}) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      label: "Total Tasks",
      value: stats.total,
      change: "+12%",
      icon: CheckSquare,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Completed",
      value: stats.completed,
      change: `${completionRate}%`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      change: "Active",
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Pending",
      value: stats.todo,
      change: "To Do",
      icon: Clock,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-8 text-white"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-purple-100">
              You have {stats.todo} pending tasks. Let&apos;s make today productive.
            </p>
          </div>
          <Link href="/dashboard/tasks">
            <Button variant="glass" size="lg">
              Create Task
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                  >
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {card.change}
                  </Badge>
                </div>
                <div className="text-3xl font-black">{card.value}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {card.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#a855f7"
                  fill="url(#purple)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#ec4899"
                  fill="url(#pink)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Tasks</CardTitle>
          <Link href="/dashboard/tasks">
            <Button variant="ghost" size="sm">View all <ArrowUpRight className="w-3 h-3" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No tasks yet. Create your first one!</p>
              <Link href="/dashboard/tasks">
                <Button variant="gradient">Create Task</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(task.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.status === "done"
                        ? "success"
                        : task.status === "in_progress"
                        ? "info"
                        : "secondary"
                    }
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
