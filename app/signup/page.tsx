"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Identifier must be ≥2 chars"),
  email: z.string().email("Invalid neural address"),
  password: z
    .string()
    .min(8, "Access key must be ≥8 chars")
    .regex(/[A-Z]/, "Requires uppercase matrix")
    .regex(/[0-9]/,  "Requires numeric sequence"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Key mismatch detected",
  path: ["confirm"],
});
type Form = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Initialization failed");
      toast.success("Node initialized. Welcome to the mesh.");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <AnimatedBackground />

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-sm">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="font-black text-sm gradient-text tracking-tight leading-none">NEXUS</div>
              <div className="text-[7px] font-mono text-muted-foreground tracking-widest">NEURAL·OS</div>
            </div>
          </Link>
        </div>

        <GlassCard className="p-7" variant="default">
          <div className="mb-7">
            <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-2">
              NODE·INITIALIZATION
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-1">Create your node</h1>
            <p className="text-sm text-muted-foreground">
              Already active?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Authenticate →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { id: "name",     label: "Operator ID",    Icon: User,  type: "text",     ph: "John Operator",          field: "name"    as const },
              { id: "email",    label: "Neural Address", Icon: Mail,  type: "email",    ph: "operator@nexus.com",     field: "email"   as const },
              { id: "password", label: "Access Key",     Icon: Lock,  type: "password", ph: "Min 8 · Uppercase · Num", field: "password" as const },
              { id: "confirm",  label: "Confirm Key",    Icon: Lock,  type: "password", ph: "Repeat access key",      field: "confirm" as const },
            ].map(({ id, label, Icon, type, ph, field }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {label}
                </Label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id={id}
                    type={field === "password" || field === "confirm" ? (showPwd ? "text" : "password") : type}
                    placeholder={ph}
                    className="pl-10 pr-10"
                    {...register(field)}
                  />
                  {(field === "password" || field === "confirm") && (
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {errors[field] && <p className="text-xs text-red-400 font-mono">{errors[field]?.message}</p>}
              </div>
            ))}

            <GlassButton type="submit" variant="gradient" size="lg" className="w-full mt-2" loading={loading} glow>
              Initialize Node
              <ArrowRight className="w-4 h-4" />
            </GlassButton>

            <p className="text-[10px] text-center text-muted-foreground/50 font-mono">
              By initializing, you accept the{" "}
              <Link href="#" className="text-purple-400 hover:underline">TERMS</Link> and{" "}
              <Link href="#" className="text-purple-400 hover:underline">PRIVACY·MATRIX</Link>.
            </p>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
