// app/auth-error/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button' // Assuming you're using shadcn/ui

export default function AuthError() {
  const router = useRouter()

  const handleReturnToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Login Successful!</h1>
        <p className="text-gray-700 mb-6">
          You have successfully logged in.
        </p>
        <Button 
          onClick={handleReturnToDashboard}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}