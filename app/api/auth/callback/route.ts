import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Auth callback reached', { code: code ? 'exists' : 'missing' })

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      console.log('Exchange code for session result', { data: !!data, error })
      if (error) throw error
    } catch (error) {
      console.error('Error in exchangeCodeForSession:', error)
      // Instead of throwing, let's redirect to a specific error page
      return NextResponse.redirect(new URL('/auth-exchange-error', requestUrl.origin))
    }
  }

  console.log('Redirecting to dashboard')
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}