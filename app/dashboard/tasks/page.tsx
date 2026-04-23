import { getSession } from "@/lib/auth";
import { getTasks } from "@/lib/db";
import { redirect } from "next/navigation";
import { TasksClient } from "@/components/dashboard/TasksClient";

export default async function TasksPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const tasks = user.role === "admin" ? getTasks() : getTasks(user.id);
  return <TasksClient initialTasks={tasks} />;
}
