import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
      await supabase.auth.exchangeCodeForSession(code)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
      } else {
        return NextResponse.redirect(new URL('/login', requestUrl.origin))
      }
    } catch (error) {
      console.error('Error in auth callback:', error)
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }
  }

  console.error('Auth callback: No code provided')
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}