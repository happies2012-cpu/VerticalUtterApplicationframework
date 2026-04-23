import { getSession } from "@/lib/auth";
import { getTasks } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const tasks = user.role === "admin" ? getTasks() : getTasks(user.id);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  return <DashboardOverview user={user} tasks={tasks} stats={stats} />;
}
