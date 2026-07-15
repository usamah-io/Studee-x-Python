import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value;

  // List of protected routes that require login
  const protectedRoutes = ['/lesson'];

  // 1. Redirect to /login if trying to access protected routes while logged out
  const isAccessingProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
  if (isAccessingProtectedRoute && !isLoggedIn) {
    url.pathname = '/login';
    // Append redirectTo parameter so they can redirect back after successful login
    url.searchParams.set('redirectTo', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // 2. Redirect to root (/) if trying to access admin dashboard without being an admin
  if (url.pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin', '/admin/:path*',
    '/lesson', '/lesson/:path*'
  ],
};
