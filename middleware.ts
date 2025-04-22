import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value
  const isLoggedIn = !!token

  const publicPaths = ['/', '/signup']
  const isPublic = publicPaths.includes(request.nextUrl.pathname)

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/', request.url)) // redirect to login
  }

  if (isLoggedIn && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url)) // if logged in, redirect to real homepage
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
