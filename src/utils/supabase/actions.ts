
'use server';

import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';


import type { Provider } from '@supabase/supabase-js';

const signInWith = (provider: Provider) => {
  return async (): Promise<never> => {
    const supabase = await createClient();
    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: auth_callback_url },
    });

    if (error) throw new Error(error.message);
    redirect(data.url);
  };
};

export const signinWithGoogle = signInWith('google');
export async function emailSignup(formData: FormData) {
    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const display_name = formData.get('display_name') as string; // ✅ fixed
      const supabase = await createClient();
  
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name,
          },
        },
      });
  
      console.log('Signup data:', data);
      if (error) {
        console.error('Supabase signup error:', error);
        throw new Error(error.message);
      }
  
      redirect('/');
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    }
  }
  
    

  export async function emailSignin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      console.error('Signin error:', error.message);
      throw new Error(error.message);
    }
  
    // If email confirmation is required
    if (!data.user?.email_confirmed_at) {
      redirect('/auth?error=confirm_email');
    }
  
    redirect('/');
  }
  
// Sign Out
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth');
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}