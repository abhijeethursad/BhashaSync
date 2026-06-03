import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // 1. Define our secure route zones
  const isStudentRoute = path.startsWith('/dashboard') || path.startsWith('/learning');
  const isInstructorRoute = path.startsWith('/instructor');
  const isCatalogRoute = path.startsWith('/courses'); // <-- NEW: Watch the catalog!
  const isPublicRoute = path === '/login';

  // 2. Look for our secure session cookie
  const token = request.cookies.get('bhasha_session')?.value;

  // 3. Basic Security: No token + trying to access Strictly Secure routes = kick to login
  // Note: We don't put isCatalogRoute here, because guests SHOULD be able to window-shop!
  if ((isStudentRoute || isInstructorRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Advanced Security: If they have a token, we must check their ROLE
  if (token) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
      // Native fetch is safer in Next.js Edge Middleware than Axios
      const res = await fetch(`${baseUrl}/users/${token}`);
      
      if (!res.ok) throw new Error("Invalid session token");
      const user = await res.json();
      const role = user.role; // 'student' or 'teacher'

      // SCENARIO A: They are on the /login page, but already logged in!
      if (isPublicRoute) {
        if (role === 'teacher') {
          return NextResponse.redirect(new URL('/instructor/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // SCENARIO B: A Student tries to type /instructor in the URL
      if (isInstructorRoute && role !== 'teacher') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // SCENARIO C: A Teacher tries to view Student Dashboards OR the Global Course Catalog
      if ((isStudentRoute || isCatalogRoute) && role === 'teacher') {
        // Bounce them to their own specific course management page
        return NextResponse.redirect(new URL('/instructor/courses', request.url));
      }

    } catch (error) {
      // If the database is down or they have a fake cookie, clear it and kick them out
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('bhasha_session');
      return response;
    }
  }

  // If they pass all security checks, let them proceed normally
  return NextResponse.next();
}

// 5. UPDATE MATCHER: Tell Next.js to watch the /courses route too!
export const config = {
  matcher: ['/dashboard/:path*', '/learning/:path*', '/instructor/:path*', '/courses/:path*', '/login'],
};