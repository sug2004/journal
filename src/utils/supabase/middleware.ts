

// // utils/supabase/middleware.ts
// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function updateSession(request: NextRequest) {
//   let response = NextResponse.next();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             response.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   const pathname = request.nextUrl.pathname;
//   const searchParams = request.nextUrl.searchParams;
//   const code = searchParams.get('code');

//   // ✅ Public URLs and OTP/password-reset routes
//   const publicUrls = [
//     '/auth',
//     '/auth/update-password',
//     '/auth/reset-password',
//   ];
//   const isPublic = publicUrls.some((publicPath) =>
//     pathname.startsWith(publicPath)
//   );

//   // ✅ Special case for OTP login: redirect to update-password page
//   if (!pathname.startsWith('/auth/update-password') && code && pathname === '/') {
//     const url = request.nextUrl.clone();
//     url.pathname = '/auth/update-password';
//     return NextResponse.redirect(url);
//   }

//   // ✅ Check for logged-in user
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // ✅ If user not logged in and accessing private route → redirect to /auth
//   if (!user && !isPublic) {
//     const redirectURL = request.nextUrl.clone();
//     redirectURL.pathname = '/auth';
//     redirectURL.searchParams.set('redirectedFrom', pathname);
//     return NextResponse.redirect(redirectURL);
//   }

//   return response;
// }
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// export async function updateSession(request: NextRequest) {
//   const response = NextResponse.next();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => request.cookies.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const pathname = request.nextUrl.pathname;
//   const searchParams = request.nextUrl.searchParams;
//   const code = searchParams.get('code');

//   const publicPaths = [
//     '/auth',
//     '/auth/reset-password',
//     '/auth/update-password',
//     '/auth/callback',
//   ];
//   const isPublic = publicPaths.some(path => pathname.startsWith(path));

//   // ✅ Use full origin instead of assuming localhost
//   const origin = request.nextUrl.origin;

//   // ✅ OTP Code handling
//   if (code && pathname === '/') {
//     const redirectUrl = new URL('/auth/update-password', origin);
//     return NextResponse.redirect(redirectUrl);
//   }

//   // ✅ User check
//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user && !isPublic) {
//     const redirectUrl = new URL('/auth', origin);
//     redirectUrl.searchParams.set('redirectedFrom', pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

//   return response;
// }

// In src/utils/supabase/middleware.ts
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

  // ✅ OTP Code handling - ONLY redirect if NOT on callback path
  if (code && pathname === '/' && !pathname.includes('/auth/callback')) {
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
