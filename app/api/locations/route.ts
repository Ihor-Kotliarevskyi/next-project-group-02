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
