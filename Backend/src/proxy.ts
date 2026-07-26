import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, ADMIN_COOKIE_NAME } from './lib/auth';

const PUBLIC_PATHS = ['/login', '/signup', '/Customer-Analytics', '/customer-analytics', '/backend/Customer-Analytics', '/backend/customer-analytics'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static resources, Next internals, analytics views, and authentication API routes to pass freely
  if (
    pathname.startsWith('/_next') ||
    pathname.toLowerCase().includes('customer-analytics') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/user-auth') ||
    pathname.startsWith('/api/vocab') ||
    pathname.startsWith('/api/grammar') ||
    pathname.startsWith('/api/admin') ||
    pathname.includes('.') // Ex: .css, .js, .png, favicon.ico
  ) {
    return NextResponse.next();
  }

  // Inspect auth token from cookie in Edge runtime
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const validSession = token ? await verifyToken(token) : null;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Unauthenticated user attempting to access internal admin routes
  if (!validSession && !isPublicPath) {
    // If it's a programmatic API call, reject with 401 JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: "Unauthorized access. Valid admin session required." },
        { status: 401 }
      );
    }
    // Using nextUrl.clone() ensures Next.js basePath ('/backend') is properly preserved in redirects
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user navigating to public login/signup screen - redirect to dashboard
  if (validSession && isPublicPath) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/Dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|Customer-Analytics|customer-analytics|backend/Customer-Analytics|backend/customer-analytics).*)'],
};
