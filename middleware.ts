import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if we're on a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                           req.nextUrl.pathname.startsWith('/history') ||
                           req.nextUrl.pathname.startsWith('/profile')

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Log the current route and session status
    console.log(`Middleware: Checking route ${req.nextUrl.pathname}`, { 
      isProtectedRoute, 
      hasSession: !!session 
    })

    if (session && req.nextUrl.pathname === '/') {
      // User is authenticated and trying to access root url, redirect to dashboard
      console.log('Middleware: Authenticated user accessing root url, redirecting to dashboard')
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin
      const dashboardUrl = new URL('/dashboard', baseUrl)
      
      return NextResponse.redirect(dashboardUrl)
    }

    if (!session && isProtectedRoute) {
      // User is not authenticated and trying to access a protected route
      console.log('Middleware: Unauthorized access attempt, redirecting to root url')
      
      // Use NEXT_PUBLIC_BASE_URL for redirects
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin
      const rootUrl = new URL('/', baseUrl)
      
      return NextResponse.redirect(rootUrl)
    }

    // For all other cases, allow the request to proceed
    return res

  } catch (e) {
    console.error('Middleware: Error checking authentication', e)
    
    // In case of an error, redirect to an error page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin
    const errorUrl = new URL('/auth-error', baseUrl)
    
    return NextResponse.redirect(errorUrl)
  }
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.png).*)',
  ],
}