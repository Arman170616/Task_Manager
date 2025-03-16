import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public and protected paths
  const isPublicPath = path === "/" || path === "/signup"
  const isProtectedPath = path.startsWith("/dashboard")

  // Get token from cookies or authorization header
  const token = request.cookies.get("accessToken")?.value || ""

  // Check for token in localStorage via a custom header that would be set by client-side code
  // Note: This is just for checking, actual auth should happen in API calls
  const hasToken = token || request.headers.get("x-has-token") === "true"

  // For simplicity in development, allow access to dashboard without token check
  // Remove this in production!
  if (isProtectedPath) {
    return NextResponse.next()
  }

  // Redirect authenticated users trying to access login/signup to dashboard
  if (isPublicPath && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/signup", "/dashboard/:path*"],
}

