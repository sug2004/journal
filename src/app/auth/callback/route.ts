import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const redirectTo = url.searchParams.get('next') ?? '/';

  // Prevent open redirect attacks by allowing only relative paths
  const isSafeRedirect = redirectTo.startsWith('/');
  const safeRedirectPath = isSafeRedirect ? redirectTo : '/';

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth callback error:', error.message);
      return NextResponse.redirect(`${url.origin}/auth?error=oauth_callback_failed`);
    }

    return NextResponse.redirect(`${url.origin}${safeRedirectPath}`);
  }

  return NextResponse.redirect(`${url.origin}/auth?error=missing_code`);
}
