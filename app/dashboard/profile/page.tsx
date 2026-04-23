import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/dashboard/ProfileClient";

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect("/login");
  return <ProfileClient user={user} />;
}
