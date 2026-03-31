import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../api";
import { logErrorResponse } from "../_utils/utils";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const { data } = await api.get("/locations", { params });
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
