import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../../api";
import { logErrorResponse } from "../../_utils/utils";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    if (!cookieHeader) {
      return NextResponse.json(null);
    }
    const { data } = await api.get("/users/me", {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      if (status === 401 || status === 403) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message },
        { status }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const body = await req.json();
    const { data } = await api.patch("/users/me", body, {
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
