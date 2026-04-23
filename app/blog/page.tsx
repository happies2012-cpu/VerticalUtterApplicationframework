import { getBlogPosts } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogList } from "@/components/dashboard/BlogList";

export default function PublicBlogPage() {
  const posts = getBlogPosts();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <BlogList posts={posts} />
      </div>
      <Footer />
    </div>
  );
}
