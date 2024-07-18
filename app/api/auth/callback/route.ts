import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Get the redirectedFrom parameter if it exists
  const redirectedFrom = requestUrl.searchParams.get('redirectedFrom')
  
  // Redirect to the original intended page or dashboard if not specified
  return NextResponse.redirect(new URL(redirectedFrom || '/dashboard', requestUrl.origin))
}