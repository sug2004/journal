'use client';

import {
  signinWithGoogle,
  emailSignup,
  emailSignin,
} from '@/utils/supabase/actions';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthPage(): JSX.Element {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (errorParam === 'confirm_email') {
      alert('Please confirm your email before signing in.');
    }
    
  }, [errorParam]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      {/* Left Section (hidden on small screens) */}
      <div className="hidden md:flex w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/loginbg.png')" }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-6">
          <div className="text-white text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 leading-snug">
              Discover Possibilities, <br />
              Unleash Your Brilliance
            </h1>
            <p className="text-base text-gray-200">
              Team Journal: Your collaborative space for growth and reflection.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 text-center">
            {isLogin ? 'Login to Team Journal' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            {isLogin
              ? 'Enter your credentials to access your account'
              : 'Enter your details to sign up'}
          </p>

          <form action={isLogin ? emailSignin : emailSignup}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="input input-bordered w-full mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
              {isLogin && (
                <a
                href="/auth/reset-password"
                className="float-right text-sm text-blue-500 hover:underline"
              >
                Forgot your password?
              </a>
              )}
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="input input-bordered w-full mb-4"
            />

            {!isLogin && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  name="display_name"
                  type="text"
                  placeholder="Enter your display name"
                  required
                  className="input input-bordered w-full mb-4"
                />
              </>
            )}

            <button
              type="submit"
              className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-400 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <form>
            <button
              className="btn w-full bg-white border text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
              formAction={signinWithGoogle}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M21.805 10.023H12.24v3.956h5.505c-.237 1.33-.944 2.457-2.008 3.212v2.642h3.241c1.896-1.744 2.996-4.315 2.996-7.273 0-.64-.07-1.26-.17-1.537z"
                  fill="#4285F4"
                />
                <path
                  d="M12.24 21.91c2.712 0 4.986-.886 6.648-2.414l-3.242-2.642c-.897.598-2.05.94-3.406.94-2.617 0-4.837-1.764-5.63-4.14H3.282v2.65c1.66 3.28 5.102 5.606 8.958 5.606z"
                  fill="#34A853"
                />
                <path
                  d="M6.61 13.653A5.99 5.99 0 0 1 6.24 12c0-.575.098-1.13.265-1.653V7.697H3.282A9.705 9.705 0 0 0 2.24 12c0 1.565.377 3.04 1.042 4.303l3.328-2.65z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.24 6.454c1.47 0 2.787.506 3.823 1.497l2.865-2.865C17.224 3.47 14.95 2.273 12.24 2.273c-3.856 0-7.298 2.327-8.958 5.606l3.328 2.65c.793-2.376 3.013-4.14 5.63-4.14z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
