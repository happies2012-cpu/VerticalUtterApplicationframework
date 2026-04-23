import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { updateUser } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const updated = updateUser(user.id, data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Update failed" }, { status: 400 });
    }
    const { password, ...safe } = updated;
    return NextResponse.json({ success: true, data: safe });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
