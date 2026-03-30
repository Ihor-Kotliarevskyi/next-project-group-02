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

    const targetUrl = process.env.BACKEND_API_URL + "/feedbacks/" + id + "?page=" + page + "&limit=" + limit;

    // ADD THIS to see exactly what URL is being called
    console.log(">>> Fetching:", targetUrl);

    const res = await fetch(targetUrl, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    console.log(">>> Backend status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      // console.log(">>> Backend response body:", text);
      return NextResponse.json({ message: "Failed to fetch feedbacks from backend" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}
