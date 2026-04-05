import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../../api";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const { data, headers, status } = await api.post("/auth/refresh", null, {
      headers: { Cookie: cookieHeader },
    });

    const response = NextResponse.json(data, { status });

    const setCookie = headers["set-cookie"];
    if (setCookie) {
      (Array.isArray(setCookie) ? setCookie : [setCookie]).forEach((c) =>
        response.headers.append("set-cookie", c)
      );
    }

    return response;
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
