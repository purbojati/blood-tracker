import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('Middleware: Session status', { exists: !!session, url: req.nextUrl.pathname })

  // Allow login and auth routes to proceed without redirection
  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname.startsWith('/auth')) {
    return res
  }

  // If there's no session and the user is trying to access a protected route, redirect to login
  if (!session && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If there's a session and the user is on the home page, redirect to dashboard
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*.png|.*.ico).*)'],
}
