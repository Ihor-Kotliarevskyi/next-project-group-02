import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  try {
    await api.post("/auth/logout", null, {
      headers: { Cookie: cookieHeader },
    });
  } catch {}

  const response = NextResponse.json({ ok: true }, { status: 200 });
  req.cookies.getAll().forEach(({ name }) => {
    response.cookies.delete(name);
  });

  return response;
}
