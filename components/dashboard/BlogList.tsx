"use client";

import { motion } from "framer-motion";
import { Clock, Tag, ArrowUpRight, Rss } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

const gradients = [
  "from-purple-600 to-pink-600",
  "from-blue-600 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-400",
  "from-indigo-600 to-purple-600",
  "from-pink-500 to-rose-500",
];

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[9px] font-mono text-muted-foreground/50 tracking-widest uppercase mb-1">INTEL·FEED</div>
        <h1 className="text-3xl font-black tracking-tight">Blog & Resources</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Decoded insights, system updates, and tactical intelligence from the Nexus mesh.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="h-full p-0 overflow-hidden cursor-pointer group" glowColor="purple">
              {/* Image area */}
              <div className={`aspect-video bg-gradient-to-br ${gradients[i % gradients.length]} relative overflow-hidden flex-shrink-0`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />
                {post.featured && (
                  <div className="absolute top-3 left-3 text-[9px] font-mono font-black bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full tracking-widest">
                    FEATURED
                  </div>
                )}
                <div className="absolute bottom-3 right-3 text-white text-[10px] font-mono flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {post.readTime}·MIN
                </div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] font-mono opacity-70">
                  INTEL·{String(i + 1).padStart(3, "0")}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Tag className="w-3 h-3 text-muted-foreground/50" />
                  <span className="text-[9px] font-mono text-muted-foreground/70 uppercase tracking-widest">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-black text-base mb-2 group-hover:text-purple-400 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4 font-light">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold">{post.author}</div>
                    <div className="text-[9px] font-mono text-muted-foreground/60">
                      {formatDate(post.publishedAt).toUpperCase()}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-lg glass-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <GlassCard className="py-16 text-center">
          <Rss className="w-12 h-12 text-muted-foreground/25 mx-auto mb-3" />
          <p className="font-mono text-muted-foreground/60 text-sm">INTEL·FEED·EMPTY — CHECK·BACK·SOON</p>
        </GlassCard>
      )}
    </div>
  );
}
