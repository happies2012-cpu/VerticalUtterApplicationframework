import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const responses = [
  "I can help you with that. Could you give me more context?",
  "Great question! Here's what I think...",
  "Based on your workspace data, I'd suggest the following approach.",
  "Let me break that down for you step by step.",
  "I've analyzed similar requests, and here's the best path forward.",
];

const knowledge: Record<string, string> = {
  hello: "Hi there! 👋 I'm Nexus AI, your productivity copilot. Ask me anything about tasks, project planning, or how to use the platform.",
  help: "I can help you with:\n• Creating and organizing tasks\n• Planning your day or week\n• Summarizing project updates\n• Drafting emails and messages\n• Answering questions about Nexus features",
  task: "To create a task, head to your Dashboard, click 'New Task', and fill in the details. You can set priority, due date, and assign it to a team member. Want me to walk you through it?",
  pricing: "We offer three plans:\n• Starter: Free forever — perfect for individuals\n• Pro: $29/month — for growing teams\n• Enterprise: $99/month — for organizations\nWhich plan fits your needs best?",
  feature: "Nexus offers smart analytics, team collaboration, an AI assistant (that's me!), enterprise security, global infrastructure, and a unified inbox. Which one would you like to explore?",
};

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message required" }, { status: 400 });
    }

    const lower = message.toLowerCase();
    let reply = responses[Math.floor(Math.random() * responses.length)];

    for (const [key, response] of Object.entries(knowledge)) {
      if (lower.includes(key)) {
        reply = response;
        break;
      }
    }

    if (lower.includes("name") || lower.includes("who are you")) {
      reply = `I'm Nexus AI, your intelligent assistant. I'm here to help you, ${user.name}, get more done and work smarter.`;
    }

    if (lower.includes("time") || lower.includes("date")) {
      reply = `It's currently ${new Date().toLocaleString()}. How can I help you make the most of it?`;
    }

    await new Promise((r) => setTimeout(r, 600));

    return NextResponse.json({
      success: true,
      data: {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
