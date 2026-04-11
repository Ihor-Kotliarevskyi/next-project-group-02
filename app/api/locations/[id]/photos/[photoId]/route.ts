import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../../../../api";
import { logErrorResponse } from "../../../../_utils/utils";

type RouteContext = {
  params: Promise<{ id: string; photoId: string }>;
};

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id, photoId } = await context.params;
    const cookie = req.headers.get("cookie") ?? "";

    const { data } = await api.delete(`/locations/${id}/photos/${photoId}`, {
      headers: { Cookie: cookie },
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
