"use client";

import { motion } from "framer-motion";
import { Clock, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black mb-1">Blog & Resources</h1>
        <p className="text-muted-foreground">Insights, tutorials, and product updates</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                {post.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 border-0">
                    Featured
                  </Badge>
                )}
                <div className="absolute bottom-3 right-3 text-white text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime} min read
                </div>
              </div>
              <CardContent className="p-5">
                <Badge variant="outline" className="mb-3">
                  <Tag className="w-3 h-3 mr-1" />
                  {post.category}
                </Badge>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
