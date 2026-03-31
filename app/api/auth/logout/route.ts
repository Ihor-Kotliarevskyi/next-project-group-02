import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  // Try to invalidate session on backend (best-effort)
  try {
    await api.post("/auth/logout", null, {
      headers: { Cookie: cookieHeader },
    });
  } catch {
    // Backend unreachable or session already expired — proceed to clear client cookies
  }

  // Explicitly delete every cookie the browser sent with this request
  const response = NextResponse.json({ ok: true }, { status: 200 });
  req.cookies.getAll().forEach(({ name }) => {
    response.cookies.delete(name);
  });

  return response;
}
