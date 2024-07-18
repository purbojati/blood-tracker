import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  console.log('Middleware: Checking session')
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('Middleware: Session status', { exists: !!session })

  // If there's no session and the user is trying to access a protected route, redirect to login
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    console.log('Middleware: Redirecting to login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}