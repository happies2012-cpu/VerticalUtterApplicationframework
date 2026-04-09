"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  BarChart2,
  MessageSquare,
  Shield,
  Globe,
  Cpu,
  Sparkles,
  Play,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    icon: BarChart2,
    title: "Smart Analytics",
    description:
      "Real-time dashboards with AI-powered insights to help you make data-driven decisions.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Seamlessly collaborate with your team, assign tasks, and track progress in real-time.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cpu,
    title: "AI Assistant",
    description:
      "Your intelligent copilot that answers questions, generates content, and automates tasks.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, RBAC, SSO, and compliance tools built from the ground up.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description:
      "99.99% uptime with servers in 30+ regions ensuring lightning-fast performance worldwide.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description:
      "All your communications in one place — emails, chats, and notifications streamlined.",
    color: "from-indigo-500 to-blue-500",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for individuals and small projects.",
    features: [
      "5 Projects",
      "10 GB Storage",
      "Basic Analytics",
      "Email Support",
      "API Access",
    ],
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing teams that need more power.",
    features: [
      "Unlimited Projects",
      "100 GB Storage",
      "Advanced Analytics",
      "Priority Support",
      "AI Assistant",
      "Custom Integrations",
      "Team Collaboration",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For organizations that demand the best.",
    features: [
      "Everything in Pro",
      "Unlimited Storage",
      "Custom AI Models",
      "24/7 Dedicated Support",
      "SSO & SAML",
      "SLA Guarantee",
      "On-premise Option",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    content:
      "Nexus transformed how our 200-person team works. The AI assistant alone saves us 10+ hours per week.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Lead at Innovate",
    content:
      "The analytics dashboard gives us insights we never had before. Absolutely game-changing for our roadmap.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Emily Watson",
    role: "Founder at StartupXYZ",
    content:
      "Switched from 4 different tools to just Nexus. Our team productivity jumped by 40% in the first month.",
    rating: 5,
    avatar: "EW",
  },
];

const stats = [
  { value: "50K+", label: "Active Teams" },
  { value: "99.99%", label: "Uptime" },
  { value: "10M+", label: "Tasks Managed" },
  { value: "4.9/5", label: "User Rating" },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800 px-4 py-1.5 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Introducing Nexus 2.0 — Now with AI Superpowers
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
          >
            The Future of{" "}
            <span className="gradient-text">Team Work</span>
            <br />
            Starts Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Nexus brings together task management, real-time collaboration, AI
            assistance, and powerful analytics — all in one beautiful platform
            built for modern teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button variant="gradient" size="xl" className="group glow">
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="group">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground mt-6"
          >
            No credit card required • Free forever plan • 14-day pro trial
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything you need,{" "}
              <span className="gradient-text">nothing you don&apos;t</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nexus combines the best tools into one seamless experience —
              purpose-built for teams who move fast.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.1}>
                <div className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-black mb-4">
              Loved by <span className="gradient-text">50,000+ teams</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-border/50 bg-card">
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Start free. Scale as you grow. No surprises.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                    plan.highlighted
                      ? "border-primary bg-gradient-to-b from-primary/5 to-background shadow-xl shadow-primary/20 scale-105"
                      : "border-border/50 bg-card hover:border-primary/30"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}>
                    <Button
                      variant={plan.highlighted ? "gradient" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <Badge variant="outline" className="mb-4">About Us</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Built by teams,{" "}
              <span className="gradient-text">for teams</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              We started Nexus because we were frustrated with the fragmented
              tools landscape. We built the platform we always wanted — one that
              brings everything together without sacrificing power or simplicity.
            </p>
            <Link href="/signup">
              <Button variant="gradient" size="lg">
                Join 50,000+ Teams Today
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of teams already using Nexus to do their best work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button variant="glass" size="xl">
                  Start Free — No Credit Card
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
