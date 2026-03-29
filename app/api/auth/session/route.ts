import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL;

export async function GET(req: NextRequest) {
  const res = await fetch(`${API_URL}/auth/session`, {
    cache: "no-store",
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });
}