import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWTPayload, SafeUser } from "./types";
import { getUserById } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-super-secret-key-2026";
const COOKIE_NAME = "nexus_token";

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;
    const user = getUserById(payload.id);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`;
}

export function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
