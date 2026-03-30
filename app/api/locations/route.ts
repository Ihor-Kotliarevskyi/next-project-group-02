import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search;
  const res = await fetch(`${API_URL}/locations${search}`, {
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
