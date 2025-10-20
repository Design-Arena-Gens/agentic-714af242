import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/verify'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth'));

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin routes
  if (pathname.startsWith('/admin') && token) {
    // Token validation would be done in API routes
    return NextResponse.next();
  }

  // Issuer routes
  if (pathname.startsWith('/issuer') && token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/issuer/:path*',
    '/api/admin/:path*',
    '/api/issuer/:path*',
  ],
};
