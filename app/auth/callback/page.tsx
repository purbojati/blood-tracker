'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { searchParams, hash } = new URL(window.location.href)
      const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/dashboard'

      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
          router.push(next)
        } catch (error) {
          console.error('Error exchanging code for session:', error)
          router.push('/auth-error')
        }
      } else {
        // Handle hash fragment for implicit grant
        const accessToken = new URLSearchParams(hash.slice(1)).get('access_token')
        const refreshToken = new URLSearchParams(hash.slice(1)).get('refresh_token')
        if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        router.push(next)
        } else {
        console.error('No code or access token found')
        }
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return <p>Processing login, please wait...</p>
}