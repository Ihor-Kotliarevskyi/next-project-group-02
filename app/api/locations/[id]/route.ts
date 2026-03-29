import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RouteContext = {
  params: {
    id: string;
  }
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = context.params;

  const res = await fetch(`${API_URL}/locations/${id}`, {
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
