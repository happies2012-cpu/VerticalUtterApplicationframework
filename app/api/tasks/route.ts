import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getTasks, createTask } from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
});

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const tasks = user.role === "admin" ? getTasks() : getTasks(user.id);
  return NextResponse.json({ success: true, data: tasks });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const task = createTask({ ...data, userId: user.id });
    return NextResponse.json({ success: true, data: task });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
