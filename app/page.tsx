'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { AuthButton } from '@/components/AuthButton';
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (session) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setError('An error occurred while checking your session. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [supabase, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-red-100 to-white text-center">
      <Image src="/icon-512x512.png" width={150} height={150} alt="Blood Tracker AI Logo" className="mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-red-800">Blood Tracker AI</h1>
      <p className="text-lg mb-8 text-gray-600">Monitor your health metrics with ease and precision.</p>
      {/* Assuming AuthButton is a different button for authentication */}

      <AuthButton />
      {error && <p className="text-red-600 mt-4">{error}</p>}
      <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
        Refresh
      </Button>
    </div>
  );
}
