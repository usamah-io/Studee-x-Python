import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // Deteksi autentikasi dari Cookie Kustom (Face ID/Legacy) ATAU NextAuth Session Token
  const hasCustomAuth = request.cookies.get('isLoggedIn')?.value === 'true';
  const hasNextAuthSession = 
    request.cookies.has('__Secure-next-auth.session-token') ||
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-authjs.session-token') ||
    request.cookies.has('authjs.session-token');

  const isLoggedIn = hasCustomAuth || hasNextAuthSession;
  const userRole = request.cookies.get('userRole')?.value;

  // Rute terproteksi
  const protectedRoutes = ['/lesson', '/profile'];

  // 1. Redirect ke /login jika mengakses rute terproteksi tanpa session
  const isAccessingProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
  if (isAccessingProtectedRoute && !isLoggedIn) {
    url.pathname = '/login';
    url.searchParams.set('redirectTo', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // 2. Proteksi rute admin
  if (url.pathname.startsWith('/admin')) {
    if (userRole !== 'admin' && !hasCustomAuth) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin', '/admin/:path*',
    '/lesson', '/lesson/:path*',
    '/profile', '/profile/:path*'
  ],
};
