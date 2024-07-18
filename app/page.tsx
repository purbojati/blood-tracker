'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking user session:', error)
        setError('An error occurred while checking your session. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [supabase, router])

  const handleLogin = async () => {
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error logging in:', error)
      setError('Failed to sign in. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-4 text-blue-800">Welcome to Blood Tracker</h1>
      <p className="text-lg mb-8 text-gray-600">Monitor your health metrics with ease and precision.</p>
      <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg">
        Sign In with Google
      </Button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}