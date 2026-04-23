import { getBlogPosts } from "@/lib/db";
import { BlogList } from "@/components/dashboard/BlogList";

export default function DashboardBlogPage() {
  const posts = getBlogPosts();
  return <BlogList posts={posts} />;
}
