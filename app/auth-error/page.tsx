'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthError() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Card className="w-96">
        <CardHeader className="flex flex-col gap-2 items-center">
          <CardTitle className="text-2xl font-bold ">Login Successful!</CardTitle>
        </CardHeader >
        <CardContent className="text-center">
          <p className="text-gray-700 mb-6">
            You have successfully logged in.
          </p>
          <Button
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`)}
          >
            Complete Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}