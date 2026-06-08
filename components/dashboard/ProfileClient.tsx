"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Shield, Calendar, Save, User, Key, Terminal } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import type { SafeUser } from "@/lib/types";

const roleConfig = {
  admin:   { label: "ROOT·ACCESS",     cls: "text-orange-400 border-orange-500/30 bg-orange-500/10",  icon: "👑" },
  manager: { label: "MANAGER·NODE",    cls: "text-blue-400 border-blue-500/30 bg-blue-500/10",        icon: "🛡" },
  user:    { label: "OPERATOR·NODE",   cls: "text-green-400 border-green-500/30 bg-green-500/10",     icon: "⚡" },
};

export function ProfileClient({ user }: { user: SafeUser }) {
  const router  = useRouter();
  const [name,   setName]   = useState(user.name);
  const [bio,    setBio]    = useState(user.bio || "");
  const [saving, setSaving] = useState(false);

  const rc = roleConfig[user.role];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("Identity node updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">IDENTITY·NODE</div>
        <h1 className="text-3xl font-black tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your operator identity and credentials</p>
      </motion.div>

      {/* Identity card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-black glow">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-green-500 border-2 border-background flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
                <span className={`text-[9px] font-mono px-2 py-1 rounded-full border ${rc.cls}`}>
                  {rc.icon} {rc.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2 mb-4">
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  NODE·ACTIVE·{formatDate(user.createdAt).toUpperCase()}
                </span>
              </div>
              {user.bio && (
                <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-md">{user.bio}</p>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Edit form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <GlassCard className="p-6">
          <div className="mb-5">
            <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">MODIFY·IDENTITY</div>
            <h3 className="font-black text-base">Update profile</h3>
          </div>
          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Operator ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 glass-sm border-white/10" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Neural Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input id="email" value={user.email} disabled className="pl-10 opacity-50" />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground/40">IMMUTABLE·FIELD</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Operator Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your operational role..."
                className="flex min-h-[100px] w-full rounded-xl glass-sm border border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/50 resize-none"
              />
            </div>
            <GlassButton type="submit" variant="gradient" loading={saving} glow>
              <Save className="w-4 h-4" />
              Sync Identity
            </GlassButton>
          </form>
        </GlassCard>
      </motion.div>

      {/* Access info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <GlassCard className="p-6" variant="neon">
          <div className="mb-4">
            <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">ACCESS·MATRIX</div>
            <h3 className="font-black text-base">Security node</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: Shield,   label: "Clearance Level", value: rc.label,                       cls: rc.cls },
              { icon: Key,      label: "Auth Protocol",   value: "JWT·HTTPONLY·7DAY·SESSION",     cls: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
              { icon: Terminal, label: "2FA Status",      value: "SINGLE·FACTOR·ACTIVE",          cls: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
            ].map(({ icon: Icon, label, value, cls }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="w-4 h-4 text-muted-foreground/60" />
                  <span className="font-mono text-xs text-muted-foreground">{label}</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-1 rounded border ${cls}`}>{value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
