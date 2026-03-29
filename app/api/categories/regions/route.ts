import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const res = await fetch(`${API_URL}/categories/regions`, {
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
