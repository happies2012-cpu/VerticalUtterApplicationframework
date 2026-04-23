import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Chatbot } from "@/components/chatbot/Chatbot";

export default async function ChatbotPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  return <Chatbot user={user} />;
}
