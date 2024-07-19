'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuth = async () => {
      // Fetch the session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error.message);
        router.push('/');
        return;
      }

      // Redirect based on session availability
      if (session) {
        router.push('/dashboard'); // Redirect to the desired page after successful login
      } else {
        router.push('/');
      }
    };

    handleAuth();
  }, [supabase, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
};

export default AuthCallback;
