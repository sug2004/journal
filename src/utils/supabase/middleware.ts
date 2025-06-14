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
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const url = request.nextUrl;
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  const code = searchParams.get('code');
  const provider = searchParams.get('provider');

  const publicPaths = [
    '/auth',
    '/auth/reset-password',
    '/auth/update-password',
    '/auth/callback',
  ];
  const isPublic = publicPaths.some(path => pathname.startsWith(path));

  // ✅ 1. Force session cookie to be created if ?code is present (OAuth/Email)
  if (code) {
    await supabase.auth.getSession(); // makes sure cookies are set properly
  }

  // ✅ 2. Only redirect to update-password if code present and not from OAuth
  if (code && pathname === '/' && !provider) {
    const redirectUrl = new URL('/auth/update-password', url.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ 3. Check user after session hydration
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isPublic) {
    const redirectUrl = new URL('/auth', url.origin);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
