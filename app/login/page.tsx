"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, Terminal, Shield, Activity } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid neural address"),
  password: z.string().min(1, "Access key required"),
});
type Form = z.infer<typeof schema>;

const systemStats = [
  { label: "Active Nodes",   value: "50K+",   icon: Activity, color: "text-green-400" },
  { label: "Security Level", value: "AES-256", icon: Shield,   color: "text-blue-400" },
  { label: "Uptime",         value: "99.99%",  icon: Terminal, color: "text-purple-400" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Authentication failed");
      toast.success("Neural link established");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Access denied");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      <AnimatedBackground />

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-pink-900" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-6 glow"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="text-[9px] font-mono text-purple-300/60 tracking-widest uppercase mb-2">
              NEXUS·NEURAL·OS
            </div>
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
              Neural Link
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                Established.
              </span>
            </h2>
            <p className="text-purple-200/60 text-sm leading-relaxed">
              Authenticate to access your command workspace and resume all active operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 mt-10">
            {systemStats.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-3 rounded-xl bg-white/5 border border-white/8 text-center"
              >
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5`} />
                <div className={`text-sm font-black ${color}`}>{value}</div>
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-left space-y-2">
            {["Zero-trust architecture active", "AES-256 session encryption", "Multi-region failover enabled"].map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 text-xs text-purple-200/50 font-mono"
              >
                <span className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />
                {s}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-black gradient-text">NEXUS</span>
            </Link>
          </div>

          <div className="mb-7">
            <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-2">
              AUTHENTICATION·SEQUENCE
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Access Terminal</h1>
            <p className="text-sm text-muted-foreground">
              No credentials?{" "}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Initialize new node →
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <GlassCard className="p-4 mb-6 border-blue-500/20" variant="subtle">
            <div className="text-[9px] font-mono text-blue-400/80 tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              Demo Access Codes
            </div>
            <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
              <div><span className="text-purple-400">ADMIN</span> · admin@nexus.com / Admin@123</div>
              <div><span className="text-blue-400">MANAGER</span> · manager@nexus.com / Manager@123</div>
              <div><span className="text-green-400">USER</span> · user@nexus.com / User@123</div>
            </div>
          </GlassCard>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Neural Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="operator@nexus.com" className="pl-10" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-400 font-mono">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Access Key
                </Label>
                <Link href="/forgot-password" className="text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors">
                  RECOVER·KEY →
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type={showPwd ? "text" : "password"} placeholder="Enter access key" className="pl-10 pr-10" {...register("password")} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 font-mono">{errors.password.message}</p>}
            </div>

            <GlassButton
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              glow
            >
              Authenticate
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          </form>

          <p className="text-center text-[10px] font-mono text-muted-foreground/40 mt-6">
            NEXUS·NEURAL·OS // ZERO·TRUST·ACTIVE // AES-256
          </p>
        </motion.div>
      </div>
    </div>
  );
}
