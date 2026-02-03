import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, User } from './lib/auth';

// TODO AUTH 2: Configure Route Protection (Proxy)
// This file intercepts EVERY request. We can check cookies here to decide
// if a user is allowed to visit a page.

// Step 1: Define which routes need what permissions
const PROTECTED_ROUTES = {
  // Key: Route path (starts with)
  // Value: Array of allowed roles
  // Example: '/dashboard': ['user', 'admin'],
  '/dashboard': ['user', 'admin'],
  '/private': ['admin'],
} as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // TODO AUTH: Implement Route Protection Logic
  
  const authCookie = request.cookies.get(AUTH_COOKIE)
  let user: User | null = null;
  if(authCookie){
    try{
      user = JSON.parse(authCookie.value)
    }catch{
      console.log('tidak punya cookie')
    }
  }

  const isLoggedin = !!user;

  if(isLoggedin && pathname === '/login'){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const protectedRouteKey = Object.keys(PROTECTED_ROUTES).find(route => pathname.startsWith(route))

  if (protectedRouteKey) {
    // if not logged in, we kick them into login page
    if (!isLoggedin){
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    // RBAC

    const allowedRoles = PROTECTED_ROUTES[protectedRouteKey as keyof typeof PROTECTED_ROUTES]
    if(user && !allowedRoles.includes(user.role as any)){
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
  }
  
  return NextResponse.next();
}
