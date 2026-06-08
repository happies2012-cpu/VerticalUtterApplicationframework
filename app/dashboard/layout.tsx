import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex bg-background relative">
      <AnimatedBackground />
      <Sidebar user={user} />
      <main className="flex-1 min-w-0 relative z-10">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
