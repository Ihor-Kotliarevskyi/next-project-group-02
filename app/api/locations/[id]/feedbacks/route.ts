

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "3";
      const targetUrl = `https://node-project-group-02.onrender.com/locations/${id}/feedbacks?page=${page}&limit=${limit}`

    const res = await fetch(targetUrl, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Backend error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}