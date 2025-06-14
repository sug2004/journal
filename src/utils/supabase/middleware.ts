
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

  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  const publicPaths = [
    '/auth',
    '/auth/reset-password',
    '/auth/update-password',
    '/auth/callback',
  ];
  const isPublic = publicPaths.some(path => pathname.startsWith(path));

  // ✅ Use full origin instead of assuming localhost
  const origin = request.nextUrl.origin;

  // ✅ OTP Code handling
  if (code && pathname === '/') {
    const redirectUrl = new URL('/auth/update-password', origin);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ User check
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isPublic) {
    const redirectUrl = new URL('/auth', origin);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
