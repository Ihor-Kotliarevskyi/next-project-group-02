import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL;

export async function POST(req: NextRequest) {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: req.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  const data = await res.text();

  const response = new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
