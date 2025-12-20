import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires auth
  const isProtected = protectedRoutes.some(route => {
    if (route.includes('[')) {
      const pattern = route.replace('[id]', '[^/]+');
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return pathname.startsWith(route);
  });

  if (isProtected) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
