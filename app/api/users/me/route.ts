import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL;

export async function GET(req: NextRequest) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Cookie: req.headers.get("cookie") ?? "",
    },
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

export async function PATCH(req: NextRequest) {
  const body = await req.text();

  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": req.headers.get("Content-Type") ?? "application/json",
      Cookie: req.headers.get("cookie") ?? "",
    },
    body,
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
