

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const url = request.nextUrl;
  const pathname = url.pathname;
  const code = url.searchParams.get('code');
  const type = url.searchParams.get('type'); // important
  const origin = url.origin;

  const publicPaths = [
    '/auth',
    '/auth/reset-password',
    '/auth/update-password',
    '/auth/callback',
  ];

  const isPublic = publicPaths.some(path => pathname.startsWith(path));

  // ✅ Only redirect to /auth/update-password for password reset (not OAuth)
  if (code && type === 'recovery' && pathname === '/') {
    const redirectUrl = new URL('/auth/update-password', origin);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ Redirect unauthenticated users trying to access private routes
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isPublic) {
    const redirectUrl = new URL('/auth', origin);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
