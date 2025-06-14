
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  // ✅ Public URLs and OTP/password-reset routes
  const publicUrls = [
    '/auth',
    '/auth/update-password',
    '/auth/reset-password',
  ];
  const isPublic = publicUrls.some((publicPath) =>
    pathname.startsWith(publicPath)
  );

  // ✅ Special case for OTP login: redirect to update-password page
  if (!pathname.startsWith('/auth/update-password') && code && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/update-password';
    return NextResponse.redirect(url);
  }

  // ✅ Check for logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ If user not logged in and accessing private route → redirect to /auth
  if (!user && !isPublic) {
    const redirectURL = request.nextUrl.clone();
    redirectURL.pathname = '/auth';
    redirectURL.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectURL);
  }

  return response;
}
