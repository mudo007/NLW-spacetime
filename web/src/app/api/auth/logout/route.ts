import { NextRequest, NextResponse } from 'next/server'
// this is a "backend in the frontend", provided by next.js
export async function GET(request: NextRequest) {
  // redirect the user to our root page
  const redirectURL = new URL('/', request.url)

  return NextResponse.redirect(redirectURL, {
    headers: {
      // We logout by merely forcibly expiring the cookie
      'Set-Cookie': 'token=; Path=/; max-age=0;',
    },
  })
}
