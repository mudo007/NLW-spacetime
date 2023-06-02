import { NextRequest, NextResponse } from 'next/server'

const signInUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    // save the original url for a redirect after the login using cookies
    // HttpOnly -> makes it invisible to the inspector
    return NextResponse.redirect(signInUrl, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20`,
      },
    })
  }

  return NextResponse.next()
}

// The matcher config will define which pages will require the use to be authenticated
export const config = {
  matcher: '/memories/:path*',
}
