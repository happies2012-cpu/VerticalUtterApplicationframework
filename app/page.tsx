"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Zap, ArrowRight, CheckCircle, Star, Users, BarChart2,
  MessageSquare, Shield, Globe, Cpu, Sparkles, Terminal,
  ChevronRight, Activity, Layers, Network, Lock, Wifi,
  Database, Code2, ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AnimatedBackground, SectionGlow } from "@/components/ui/AnimatedBackground";
import { Badge } from "@/components/ui/badge";

/* ─────────────── Data ─────────────── */
const features = [
  { icon: BarChart2,    color: "from-blue-500 to-cyan-400",     title: "Neural Analytics",       desc: "Quantum-grade data processing with predictive AI matrices delivering insights at 99.7% accuracy across all operational vectors." },
  { icon: Users,        color: "from-purple-500 to-fuchsia-500", title: "Sync Protocol",          desc: "Multi-node team synchronization with sub-10ms latency. Assign tasks, track states, and collaborate across distributed meshes." },
  { icon: Cpu,          color: "from-orange-500 to-red-500",     title: "AI Core v3.0",           desc: "Large-language neural copilot trained on 180B parameters. Autonomous task generation, code synthesis, and anomaly detection." },
  { icon: Shield,       color: "from-green-500 to-emerald-400",  title: "Cryptowall Shield",      desc: "Zero-trust architecture with AES-256 quantum encryption. RBAC matrices, SSO nodes, and real-time threat neutralization." },
  { icon: Globe,        color: "from-pink-500 to-rose-500",      title: "Orbital CDN",            desc: "99.99% uptime guaranteed across 42 global edge nodes. Auto-failover, load distribution, and <50ms global response time." },
  { icon: MessageSquare,color: "from-indigo-500 to-blue-500",    title: "Unified Comm Bus",       desc: "All signals routed through a single encrypted bus — email, chat, push, API events — with priority queuing and replay." },
];

const metrics = [
  { label: "Neural Nodes Active",  value: "50K+",  icon: Network,   color: "text-purple-400" },
  { label: "System Uptime",        value: "99.99%", icon: Activity,  color: "text-green-400" },
  { label: "Operations Processed", value: "10M+",   icon: Database,  color: "text-blue-400" },
  { label: "Threat Index",         value: "0.001",  icon: Shield,    color: "text-pink-400" },
];

const plans = [
  {
    name: "STARTER·NODE",
    price: "$0",
    badge: "Open Access",
    desc: "Deploy your first neural workspace. No commitment required.",
    features: ["5 Project matrices", "10 GB secure storage", "Basic telemetry", "Community uplink", "API gateway"],
    cta: "Initialize Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "PRO·CORE",
    price: "$29",
    badge: "Most Deployed",
    desc: "Full-spectrum operations for high-velocity teams.",
    features: ["∞ Project matrices", "100 GB encrypted storage", "Advanced telemetry", "Priority support line", "AI Core access", "Custom integrations", "Team sync protocol", "Workflow automation"],
    cta: "Activate Protocol",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "ENTERPRISE·HUB",
    price: "$99",
    badge: "Classified",
    desc: "Maximum throughput for mission-critical organizations.",
    features: ["Everything in PRO·CORE", "∞ Storage matrix", "Custom AI models", "24/7 Neural support", "SSO + SAML nodes", "99.99% SLA contract", "On-premise deployment", "Dedicated node cluster"],
    cta: "Request Access",
    href: "/contact",
    highlighted: false,
  },
];

const testimonials = [
  { name: "Sarah Chen",       role: "CTO · TechFlow Systems",     rating: 5, avatar: "SC", content: "Nexus transformed our distributed ops. The AI core alone recovered 340+ engineer hours in Q3. It's not a tool — it's an upgrade." },
  { name: "Marcus Rodriguez", role: "Neural Architect · Innovate", rating: 5, avatar: "MR", content: "The analytics matrix surfaces anomalies we couldn't detect manually. Our incident response time dropped 78% in 6 weeks." },
  { name: "Emily Watson",     role: "Founder · StartupXYZ",       rating: 5, avatar: "EW", content: "Consolidated 6 fragmented systems into one unified hub. First month productivity output: +40%. The ROI is undeniable." },
];

const techStack = [
  { icon: Code2,    label: "Next.js 15" },
  { icon: Layers,   label: "TypeScript" },
  { icon: Database, label: "Encrypted DB" },
  { icon: Wifi,     label: "Edge Network" },
  { icon: Lock,     label: "Zero Trust" },
  { icon: Cpu,      label: "AI Core" },
];

/* ─────────────── Animation helpers ─────────────── */
function FadeSlide({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/* ─────────────── Terminal typewriter ─────────────── */
function TerminalBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm border border-purple-500/30 text-sm font-mono text-purple-400 mb-8"
    >
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-green-400">SYS:</span>
      <span>NEXUS·OS 2.0 initialized — Neural superpowers online</span>
      <Sparkles className="w-3.5 h-3.5" />
    </motion.div>
  );
}

/* ─────────────── Page ─────────────── */
export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 sm:px-6 text-center"
        >
          <TerminalBadge />

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] mb-6"
          >
            <span className="block text-foreground">THE FUTURE</span>
            <span className="block gradient-text glow-text">OF TEAM WORK</span>
            <span className="block text-foreground/70 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black">
              STARTS HERE.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed font-light"
          >
            Nexus integrates{" "}
            <span className="text-purple-400 font-semibold">AI-driven task orchestration</span>
            , real-time synchronization, and predictive analytics into a single unified command interface. Built for teams operating at the edge.
          </motion.p>

          {/* System status row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-4 mb-10 flex-wrap text-xs font-mono text-muted-foreground"
          >
            {["ZERO·TRUST·AUTH", "AES-256·ENCRYPTED", "SUB-10ms·LATENCY", "42·EDGE·NODES"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-green-400" />
                {s}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          >
            <Link href="/signup">
              <GlassButton variant="gradient" size="xl" glow>
                Initialize Workspace
                <ArrowRight className="w-5 h-5" />
              </GlassButton>
            </Link>
            <Link href="/login">
              <GlassButton variant="ghost-glass" size="xl">
                <Terminal className="w-4 h-4" />
                Access Terminal
              </GlassButton>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-xs font-mono text-muted-foreground/60"
          >
            NO·CREDIT·CARD // FREE·TIER·ACTIVE // 14·DAY·PRO·TRIAL
          </motion.p>

          {/* Metrics row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {metrics.map((m) => (
              <GlassCard key={m.label} className="p-4 text-center" hover={false}>
                <m.icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`} />
                <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">
                  {m.label}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ TECH STACK STRIP ═══════════════ */}
      <section className="relative py-8 border-y border-white/10 overflow-hidden">
        <div className="absolute inset-0 glass-sm" />
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-4">
              Powered By
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {techStack.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                <Icon className="w-4 h-4 text-purple-400/70" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="relative py-28 overflow-hidden">
        <SectionGlow color="purple" className="top-1/2 left-0" />
        <SectionGlow color="blue" className="top-1/3 right-0" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <FadeSlide className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-purple-400 uppercase mb-4 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5">
              <Terminal className="w-3 h-3" />
              System Modules · v2.6
            </div>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight mb-4">
              <span className="gradient-text">Six Core Systems.</span>
              <br />
              <span className="text-foreground/80">One Unified Platform.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Each module is engineered for maximum throughput, minimal latency, and seamless interoperability across the Nexus neural mesh.
            </p>
          </FadeSlide>

          <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <motion.div key={f.title} variants={cardVariant}>
                <GlassCard className="p-6 group h-full" glowColor="purple">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[9px] font-mono text-muted-foreground/60 tracking-widest uppercase mb-1">
                    MODULE·ACTIVE
                  </div>
                  <h3 className="font-black text-lg mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-mono text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>EXPLORE MODULE</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF ═══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 glass-sm" />
        <SectionGlow color="pink" className="bottom-0 right-1/4" size="md" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <FadeSlide className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-pink-400 uppercase mb-4 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/5">
              <Activity className="w-3 h-3" />
              Signal Received · 50K+ Operators
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              The network{" "}
              <span className="gradient-text">speaks.</span>
            </h2>
          </FadeSlide>

          <StaggerGrid className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={cardVariant}>
                <GlassCard className="p-6 h-full" glowColor="pink">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing" className="relative py-28 overflow-hidden">
        <SectionGlow color="cyan" className="top-1/2 left-1/2" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <FadeSlide className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-cyan-400 uppercase mb-4 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5">
              <Database className="w-3 h-3" />
              Pricing Matrix · Transparent
            </div>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight mb-4">
              Select your{" "}
              <span className="gradient-text-cyan">access tier.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              All tiers include core Nexus capabilities. Upgrade or downgrade at any time. No data held hostage.
            </p>
          </FadeSlide>

          <StaggerGrid className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={cardVariant} className="relative">
                {plan.highlighted && (
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-600 p-px z-0">
                    <div className="absolute inset-0 rounded-2xl" />
                  </div>
                )}
                <GlassCard
                  className={`relative z-10 p-7 h-full flex flex-col ${plan.highlighted ? "border-0" : ""}`}
                  variant={plan.highlighted ? "dark" : "default"}
                  glowColor="purple"
                  glow={plan.highlighted}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-[10px] font-mono font-black rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white tracking-widest">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="text-[9px] font-mono text-muted-foreground/60 tracking-widest mb-2">
                    {plan.highlighted ? "RECOMMENDED·PROTOCOL" : "ACCESS·TIER"}
                  </div>
                  <h3 className="font-black text-base tracking-tight mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-5">{plan.desc}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground text-sm font-mono">/mo</span>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="font-mono text-xs text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}>
                    <GlassButton
                      variant={plan.highlighted ? "gradient" : "neon"}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                      <ChevronRight className="w-4 h-4" />
                    </GlassButton>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section id="about" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 glass-sm" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <FadeSlide className="text-center">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-green-400 uppercase mb-6 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/5">
                <Network className="w-3 h-3" />
                Origin Story · Classified
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Built by operators,
                <br />
                <span className="gradient-text">for operators.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We were a distributed team drowning in fragmented tooling. Seven apps. Fourteen integrations. Zero coherence. So we built Nexus — the unified command layer we always needed. Today, 50,000+ teams run their operations on our neural mesh.
              </p>
              <Link href="/signup">
                <GlassButton variant="gradient" size="lg" glow>
                  Join the Network
                  <Users className="w-4 h-4" />
                </GlassButton>
              </Link>
            </FadeSlide>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-pink-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-purple-500/40 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-pink-500/30 rounded-full blur-[120px]" />
        </div>
        {/* Grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <FadeSlide>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-purple-300 uppercase mb-8 px-3 py-1.5 rounded-full border border-purple-300/30 bg-purple-300/10">
              <Zap className="w-3 h-3" />
              SYSTEM·READY // AWAITING·INITIALIZATION
            </div>
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-black text-white tracking-tight mb-6">
              Ready to upgrade
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
                your workflow?
              </span>
            </h2>
            <p className="text-purple-200/70 text-lg mb-10 max-w-xl mx-auto">
              50,000+ teams already operate on the Nexus mesh. Your node is waiting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <GlassButton variant="glass" size="xl" className="border-white/30 text-white hover:bg-white/20">
                  Initialize Free Node
                  <ArrowRight className="w-5 h-5" />
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="ghost-glass" size="xl" className="border-white/20 text-white/80 hover:text-white">
                  Contact Command
                </GlassButton>
              </Link>
            </div>
            <p className="text-purple-300/40 text-xs font-mono mt-8">
              NO·CREDIT·CARD // INSTANT·ACCESS // CANCEL·ANYTIME
            </p>
          </FadeSlide>
        </div>
      </section>

      <Footer />
    </div>
  );
}
