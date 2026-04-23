import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUsers } from "@/lib/db";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const users = getUsers().map(({ password, ...u }) => u);
  return NextResponse.json({ success: true, data: users });
}
