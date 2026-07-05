import { NextResponse } from "next/server";
import { checkPassword, AUTH_COOKIE, AUTH_VALUE } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    return NextResponse.redirect(new URL("/login?error=1", req.url), { status: 303 });
  }
  const res = NextResponse.redirect(new URL("/", req.url), { status: 303 });
  res.cookies.set(AUTH_COOKIE, AUTH_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
