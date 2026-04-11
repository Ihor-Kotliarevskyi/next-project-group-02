import { NextRequest, NextResponse } from "next/server";
import { logErrorResponse } from "../../../_utils/utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cookie = req.headers.get("cookie") ?? "";
    const formData = await req.formData();

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/locations/${id}/photos`,
      {
        method: "POST",
        headers: { Cookie: cookie },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      logErrorResponse(data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /locations/:id/photos error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
