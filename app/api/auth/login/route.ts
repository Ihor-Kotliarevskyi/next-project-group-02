import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const apiRes = await api.post("auth/login", body);

        const response = NextResponse.json(apiRes.data, {
        status: apiRes.status,
        });

        const cookies = apiRes.headers["set-cookie"];

        if (cookies && Array.isArray(cookies)) {
        cookies.forEach((cookie) => {
            response.headers.append("set-cookie", cookie);
        });
        }

        return response;
    } catch (error) {
        if (isAxiosError(error)) {
        logErrorResponse(error.response?.data);

        return NextResponse.json(
            {
            error: error.message,
            response: error.response?.data,
            },
            { status: error.response?.status || 500 }
        );
        }

        logErrorResponse({ message: (error as Error).message });

        return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
        );
    }
}



