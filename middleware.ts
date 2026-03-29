import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/profile', '/favorites', '/settings']; 

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    const isProtected = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    if (!isProtected) return NextResponse.next();

    // Check for your auth cookie (use your real cookie name)
    const isAuthenticated = req.cookies.has('accessToken');

    if (!isAuthenticated) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname); 
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/favorites/:path*', '/settings/:path*'],
};