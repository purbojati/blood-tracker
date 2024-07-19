'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button' // Assuming you're using shadcn/ui
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
          skipBrowserRedirect: true,
        }
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
    router.push(process.env.NEXT_PUBLIC_BASE_URL || '/')
  }

  return user ? (
    <div className="flex justify-center">
      <Button variant="secondary" onClick={handleSignOut}>Sign Out</Button>
    </div>
  ) : (
    <div className="flex justify-center">
      <Button onClick={handleSignIn} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg">Sign In with Google</Button>
    </div>
  )
}