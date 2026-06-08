"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit, CheckCircle, Circle, Clock,
  AlertCircle, X, Search, Terminal, Zap,
} from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Task } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

type TaskFormData = {
  title: string;
  description: string;
  priority: Task["priority"];
  status: Task["status"];
};

const emptyForm: TaskFormData = { title: "", description: "", priority: "medium", status: "todo" };

const priorityConfig = {
  high:   { label: "CRITICAL", cls: "text-red-400 border-red-500/30 bg-red-500/10" },
  medium: { label: "MEDIUM",   cls: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  low:    { label: "LOW",      cls: "text-green-400 border-green-500/30 bg-green-500/10" },
};

const statusConfig = {
  todo:        { label: "QUEUED",   cls: "text-muted-foreground border-border/50 bg-muted/30", dot: "bg-muted-foreground" },
  in_progress: { label: "ACTIVE",   cls: "text-blue-400 border-blue-500/30 bg-blue-500/10",    dot: "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]" },
  done:        { label: "COMPLETE", cls: "text-green-400 border-green-500/30 bg-green-500/10", dot: "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" },
};

export function TasksClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks,      setTasks]      = useState<Task[]>(initialTasks);
  const [showForm,   setShowForm]   = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [form,       setForm]       = useState<TaskFormData>(emptyForm);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState<"all" | Task["status"]>("all");
  const [submitting, setSubmitting] = useState(false);

  const filtered = tasks.filter((t) => {
    const s = t.title.toLowerCase().includes(search.toLowerCase());
    const f = filter === "all" || t.status === filter;
    return s && f;
  });

  const openNewForm = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEditForm = (task: Task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, priority: task.priority, status: task.status });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Operation title required"); return; }
    setSubmitting(true);
    try {
      const url    = editingId ? `/api/tasks/${editingId}` : "/api/tasks";
      const method = editingId ? "PATCH" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      if (editingId) {
        setTasks(tasks.map((t) => (t.id === editingId ? result.data : t)));
        toast.success("Operation updated");
      } else {
        setTasks([result.data, ...tasks]);
        toast.success("Operation initialized");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this operation?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("Operation terminated");
    } catch {
      toast.error("Failed to terminate operation");
    }
  };

  const cycleStatus = async (task: Task) => {
    const next: Record<Task["status"], Task["status"]> = { todo: "in_progress", in_progress: "done", done: "todo" };
    try {
      const res    = await fetch(`/api/tasks/${task.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next[task.status] }) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setTasks(tasks.map((t) => (t.id === task.id ? result.data : t)));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const StatusIcon = ({ status }: { status: Task["status"] }) => {
    if (status === "done")        return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === "in_progress") return <Clock className="w-5 h-5 text-blue-400" />;
    return <Circle className="w-5 h-5 text-muted-foreground/50" />;
  };

  const filterButtons = [
    { value: "all" as const,        label: "ALL·OPS" },
    { value: "todo" as const,       label: "QUEUED" },
    { value: "in_progress" as const,label: "ACTIVE" },
    { value: "done" as const,       label: "COMPLETE" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">TASK·MATRIX</div>
          <h1 className="text-3xl font-black tracking-tight">Operations</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {tasks.length} total &middot; {tasks.filter((t) => t.status === "done").length} completed &middot; {tasks.filter((t) => t.status === "in_progress").length} active
          </p>
        </div>
        <GlassButton variant="gradient" onClick={openNewForm} glow>
          <Plus className="w-4 h-4" />
          Initialize Op
        </GlassButton>
      </motion.div>

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input placeholder="Search operations..." className="pl-10 glass-sm border-white/10 font-mono text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 p-1 glass-sm rounded-xl">
          {filterButtons.map((f) => (
            <GlassButton
              key={f.value}
              variant={filter === f.value ? "gradient" : "ghost-glass"}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="text-[10px] font-mono tracking-wider"
            >
              {f.label}
            </GlassButton>
          ))}
        </div>
      </motion.div>

      {/* Task list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="py-16 text-center">
                <Terminal className="w-12 h-12 text-muted-foreground/25 mx-auto mb-3" />
                <p className="font-mono text-muted-foreground/60 text-sm">
                  {search || filter !== "all" ? "NO·OPERATIONS·MATCH·FILTER" : "QUEUE·EMPTY — INITIALIZE·FIRST·OP"}
                </p>
                {!search && filter === "all" && (
                  <GlassButton variant="gradient" className="mt-5" onClick={openNewForm}>
                    <Plus className="w-4 h-4" />
                    Initialize Operation
                  </GlassButton>
                )}
              </GlassCard>
            </motion.div>
          ) : (
            filtered.map((task, i) => {
              const sc = statusConfig[task.status];
              const pc = priorityConfig[task.priority];
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <GlassCard className="p-4 group" hover>
                    <div className="flex items-start gap-3">
                      <button onClick={() => cycleStatus(task)} className="mt-0.5 hover:scale-110 transition-transform flex-shrink-0" aria-label="Cycle status">
                        <StatusIcon status={task.status} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`font-semibold text-sm ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${pc.cls}`}>
                            {pc.label}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${sc.cls}`}>
                            {sc.label}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mb-1 font-light leading-relaxed">{task.description}</p>
                        )}
                        <p className="text-[10px] font-mono text-muted-foreground/50">{formatRelativeTime(task.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <GlassButton variant="ghost-glass" size="icon" onClick={() => openEditForm(task)} aria-label="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </GlassButton>
                        <GlassButton
                          variant="ghost-glass"
                          size="icon"
                          onClick={() => handleDelete(task.id)}
                          className="text-destructive hover:text-destructive hover:border-destructive/30"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-0 overflow-hidden" variant="heavy">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-0.5">
                      {editingId ? "MODIFY·OPERATION" : "INITIALIZE·OPERATION"}
                    </div>
                    <h2 className="font-black text-base">{editingId ? "Edit operation" : "New operation"}</h2>
                  </div>
                  <GlassButton variant="ghost-glass" size="icon" onClick={() => setShowForm(false)}>
                    <X className="w-4 h-4" />
                  </GlassButton>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Operation Title</Label>
                    <Input id="title" placeholder="Describe the operation..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus className="glass-sm border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="desc" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Details (optional)</Label>
                    <textarea
                      id="desc"
                      placeholder="Additional context..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="flex min-h-[80px] w-full rounded-xl glass-sm border border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/50 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "priority", label: "Priority Index", value: form.priority, key: "priority" as const, opts: [["low","LOW"],["medium","MEDIUM"],["high","CRITICAL"]] },
                      { id: "status",   label: "Status",         value: form.status,   key: "status"   as const, opts: [["todo","QUEUED"],["in_progress","ACTIVE"],["done","COMPLETE"]] },
                    ].map(({ id, label, value, key, opts }) => (
                      <div key={id} className="space-y-1.5">
                        <Label htmlFor={id} className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</Label>
                        <select
                          id={id}
                          value={value}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value as any })}
                          className="flex h-10 w-full rounded-xl glass-sm border border-white/10 px-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-500/50 font-mono"
                        >
                          {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <GlassButton type="button" variant="ghost-glass" className="flex-1" onClick={() => setShowForm(false)}>Cancel</GlassButton>
                    <GlassButton type="submit" variant="gradient" className="flex-1" loading={submitting}>
                      <Zap className="w-3.5 h-3.5" />
                      {editingId ? "Update" : "Initialize"}
                    </GlassButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
