import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../../../api";
import { logErrorResponse } from "../../../_utils/utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const page = req.nextUrl.searchParams.get("page") ?? "1";
    const limit = req.nextUrl.searchParams.get("limit") ?? "3";
    const { data } = await api.get(`/feedbacks/${id}`, {
      params: { page, limit },
    });
    return NextResponse.json(data);
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message },
        { status: error.response?.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();
    const cookieHeader = req.headers.get("cookie") ?? "";
    const { data } = await api.post(`/feedbacks/${id}`, body, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message },
        { status: error.response?.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
