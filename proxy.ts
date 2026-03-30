import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";

const authRoutes = ["/login", "/register"];

const privateRoutes = ["/profile", "/locations/new", "/locations/edit"];

const API_BASE_URL = process.env.BACKEND_API_URL ?? "https://node-project-group-02.onrender.com";

async function refreshSession(refreshToken: string): Promise<Response | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    return response.ok ? response : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      const refreshResponse = await refreshSession(refreshToken);

      if (refreshResponse) {
        const setCookieHeader = refreshResponse.headers.get("set-cookie");

        if (setCookieHeader) {
          const cookieStrings = setCookieHeader.split(/,(?=[^ ])/);

          for (const cookieStr of cookieStrings) {
            const parsed = parse(cookieStr);
            const options = {
              path: parsed.Path ?? "/",
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              maxAge: parsed["Max-Age"]
                ? Number(parsed["Max-Age"])
                : undefined,
              httpOnly: /httponly/i.test(cookieStr),
              secure: /secure/i.test(cookieStr),
              sameSite: (
                cookieStr.match(/samesite=(\w+)/i)?.[1] ?? "lax"
              ).toLowerCase() as "lax" | "strict" | "none",
            };

            if (parsed.accessToken)
              cookieStore.set("accessToken", parsed.accessToken, options);
            if (parsed.refreshToken)
              cookieStore.set("refreshToken", parsed.refreshToken, options);
            if (parsed.sessionId)
              cookieStore.set("sessionId", parsed.sessionId, options);
          }

          const updatedCookies = cookieStore.toString();

          if (isAuthRoute) {
            return NextResponse.redirect(new URL("/", request.url), {
              headers: { Cookie: updatedCookies },
            });
          }

          if (isPrivateRoute) {
            return NextResponse.next({
              headers: { Cookie: updatedCookies },
            });
          }
        }
      }
    }

    if (isAuthRoute) return NextResponse.next();
    if (isPrivateRoute)
      return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile/:path*",
    "/locations/new",
    "/locations/edit/:path*",
  ],
};