import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers, getTasks } from "@/lib/db";
import { AdminClient } from "@/components/dashboard/AdminClient";

export default async function AdminPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const users = getUsers().map(({ password, ...u }) => u);
  const tasks = getTasks();
  return <AdminClient users={users} tasks={tasks} />;
}
