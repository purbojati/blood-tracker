'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function AuthButton() {
  const [user, setUser] = useState<null | { id: string; email: string; }>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
            setUser(session?.user ? { ...session.user, email: session.user.email ?? '' } : null)
          }
        )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error signing in:', error)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
    else router.push('/')
  }

  return user ? (
    <Button onClick={handleSignOut}>Sign Out</Button>
  ) : (
    <Button onClick={handleSignIn}>Sign In with Google</Button>
  )
}