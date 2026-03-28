import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "3";

    const res = await fetch(
      `http://localhost:5000/feedbacks/${params.id}?page=${page}&limit=${limit}`
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load feedbacks" },
      { status: 500 }
    );
  }
}