// /components/Auth.tsx

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // Ensure proper Supabase client setup

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Redirect URL after authentication
      },
    });

    if (error) {
      console.error('Sign-in error:', error.message);
    } else {
      // Handle successful sign-in, e.g., redirect to a specific page
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={signInWithGoogle} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
};

export default Auth;
