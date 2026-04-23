"use client";

import { motion } from "framer-motion";
import { Users, CheckSquare, Activity, Crown, Shield, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { SafeUser, Task } from "@/lib/types";

const roleIcon = {
  admin: Crown,
  manager: Shield,
  user: UserIcon,
};

export function AdminClient({ users, tasks }: { users: SafeUser[]; tasks: Task[] }) {
  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "from-purple-500 to-pink-500" },
    { label: "Total Tasks", value: tasks.length, icon: CheckSquare, color: "from-blue-500 to-cyan-500" },
    { label: "Admins", value: users.filter((u) => u.role === "admin").length, icon: Crown, color: "from-orange-500 to-red-500" },
    { label: "Active Today", value: users.length, icon: Activity, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black mb-1">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, monitor activity, and oversee the platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-black">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const Icon = roleIcon[u.role];
                  const userTasks = tasks.filter((t) => t.userId === u.id).length;
                  return (
                    <tr key={u.id} className="border-b border-border/50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary" className="capitalize">
                          <Icon className="w-3 h-3 mr-1" />
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                      <td className="py-3">{userTasks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
