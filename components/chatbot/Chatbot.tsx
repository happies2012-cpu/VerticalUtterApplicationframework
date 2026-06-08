"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User as UserIcon, Sparkles, Loader2, Terminal, Cpu } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { SafeUser, Message } from "@/lib/types";

const SUGGESTIONS = [
  "What systems are available?",
  "How do I initialize a task?",
  "Explain the pricing matrix",
  "What is my current access tier?",
];

export function Chatbot({ user }: { user: SafeUser }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: "init",
    role: "assistant",
    content: `NEXUS·AI·CORE ONLINE\nNeural handshake confirmed, ${user.name.split(" ")[0]}.\n\nAll cognitive modules are operational. How may I assist your operations today?`,
    createdAt: new Date().toISOString(),
  }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const msg: Message = { id: Math.random().toString(36).slice(2), role: "user", content: text, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, msg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const r = await res.json();
      if (!res.ok) throw new Error(r.error);
      setMessages((m) => [...m, r.data]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Transmission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-9rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase">
            MODULE·ACTIVE
          </div>
          <h1 className="text-xl font-black tracking-tight">Nexus AI Core</h1>
          <p className="text-xs font-mono text-green-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            NEURAL·LINK·ESTABLISHED
          </p>
        </div>
      </div>

      {/* Chat area */}
      <GlassCard className="flex-1 overflow-hidden p-0 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">
            <Terminal className="w-3 h-3 text-purple-400" />
            Secure channel · end-to-end
          </div>
          <span className="text-[9px] font-mono text-muted-foreground/40">{messages.length} transmissions</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400"
                    : "bg-gradient-to-br from-purple-600 to-pink-500"
                }`}>
                  {m.role === "user"
                    ? <UserIcon className="w-4 h-4 text-white" />
                    : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[78%] group ${m.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                      : "glass-sm text-foreground font-light"
                  }`}>
                    {m.role === "assistant" && (
                      <span className="block text-[8px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-1.5">
                        AI·CORE ·{" "}{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass-sm px-4 py-3 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span className="text-xs font-mono text-muted-foreground">PROCESSING·QUERY</span>
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <GlassButton key={s} variant="ghost-glass" size="sm" onClick={() => send(s)} className="text-xs font-mono">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {s}
            </GlassButton>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
        <div className="flex-1 relative">
          <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmit query to AI core..."
            disabled={loading}
            className="pl-10 glass-sm border-white/10 font-mono text-sm"
          />
        </div>
        <GlassButton type="submit" variant="gradient" size="default" disabled={!input.trim() || loading} glow>
          <Send className="w-4 h-4" />
        </GlassButton>
      </form>
    </div>
  );
}
