<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server";
 
const BACKEND = "https://node-project-group-02.onrender.com";
 
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const url = `${BACKEND}/locations${query ? `?${query}` : ""}`;
 
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
 
    if (!res.ok) {
      return NextResponse.json(
        { message: "Backend error" },
        { status: res.status },
      );
    }
 
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Locations proxy error:", error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}
=======
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL;

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
>>>>>>> origin/main
