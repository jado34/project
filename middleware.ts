import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('your-project-id') || !supabaseKey || supabaseKey.includes('your-anon-key');

  // In demo mode or placeholder config mode, allow all routes through
  if (isDemoMode || isPlaceholderUrl) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes — always allow
  const publicRoutes = ['/', '/login'];
  if (publicRoutes.includes(pathname)) {
    // If already authenticated, redirect to their dashboard
    if (user && pathname === '/login') {
      const role = user.user_metadata?.role as string || 'student';
      const dashboardMap: Record<string, string> = {
        student: '/student/dashboard',
        lecturer: '/lecturer/dashboard',
        adviser: '/adviser/dashboard',
        hod: '/admin/dashboard',
        admin: '/admin/dashboard',
      };
      return NextResponse.redirect(
        new URL(dashboardMap[role] || '/student/dashboard', request.url)
      );
    }
    return supabaseResponse;
  }

  // Protected routes — require auth
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logos|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
