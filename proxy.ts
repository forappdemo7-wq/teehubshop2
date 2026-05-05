// proxy.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/checkout'], // routes to protect
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    
    // Admin routes require ADMIN role
    if (isAdminRoute && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Checkout is always allowed (guest checkout)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow checkout even if user is not logged in
        if (req.nextUrl.pathname.startsWith('/checkout')) {
          return true;
        }
        // Admin routes require authentication
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        // All other routes are public
        return true;
      },
    },
  }
);