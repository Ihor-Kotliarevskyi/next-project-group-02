import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

const authRoutes = ["/login", "/register"];
const privateRoutes = ["/locations/add"];

const API_BASE_URL =
  process.env.BACKEND_API_URL ?? "https://node-project-group-02.onrender.com";

async function refreshSession(refreshToken: string): Promise<Response | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
    });
    return response.ok ? response : null;
  } catch {
    return null;
  }
}

function applyCookies(response: NextResponse, setCookieHeader: string): void {
  for (const cookieStr of setCookieHeader.split(/,(?=[^ ])/)) {
    const parsed = parse(cookieStr);
    const options = {
      path: parsed.Path ?? "/",
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
      httpOnly: /httponly/i.test(cookieStr),
      secure: /secure/i.test(cookieStr),
      sameSite: (
        cookieStr.match(/samesite=(\w+)/i)?.[1] ?? "lax"
      ).toLowerCase() as "lax" | "strict" | "none",
    };

    if (parsed.accessToken)
      response.cookies.set("accessToken", parsed.accessToken, options);
    if (parsed.refreshToken)
      response.cookies.set("refreshToken", parsed.refreshToken, options);
    if (parsed.sessionId)
      response.cookies.set("sessionId", parsed.sessionId, options);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute =
    pathname === "/profile" ||
    pathname.startsWith("/profile/edit") ||
    /^\/locations\/[^/]+\/edit(\/|$)/.test(pathname) ||
    privateRoutes.some((route) => pathname.startsWith(route));

  if (!accessToken && refreshToken) {
    const refreshResponse = await refreshSession(refreshToken);
    const setCookieHeader = refreshResponse?.headers.get("set-cookie");

    if (setCookieHeader) {
      const response = isAuthRoute
        ? NextResponse.redirect(new URL("/", request.url))
        : NextResponse.next();
      applyCookies(response, setCookieHeader);
      return response;
    }
  }

  if (!accessToken) {
    if (isAuthRoute) return NextResponse.next();
    if (isPrivateRoute) return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute) return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile",
    "/profile/edit/:path*",
    "/locations/add",
    "/locations/:locationId/edit",
  ],
};
