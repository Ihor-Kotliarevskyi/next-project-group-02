import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../api";
import { logErrorResponse } from "../_utils/utils";
import { cookies } from "next/headers";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();

const cookieHeader = cookieStore
  .getAll()
  .map((c) => `${c.name}=${c.value}`)
  .join("; ");

const { data } = await api.post("/locations", body, {
  headers: {
    Cookie: cookieHeader,
  },
});

    return NextResponse.json(data);
  } catch (error) {
    console.log("ERROR:", error);

    if (isAxiosError(error)) {
      console.log("BACKEND ERROR:", error.response?.data);

      return NextResponse.json(
        { error: error.response?.data || error.message },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
