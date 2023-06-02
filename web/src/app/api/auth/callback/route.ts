import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'
// this is a "backend in the frontend", provided by next.js
export async function GET(request: NextRequest) {
  // We need to extract the query parameters
  const { searchParams } = new URL(request.url)
  const userGithubCode = searchParams.get('code')

  const registerResponse = await api.post('/register', {
    code: userGithubCode,
  })
  // this cookie is set on the middleware to implement the authorization flow
  const redirectTo = request.cookies.get('redirectTo')?.value

  const { userJwt } = registerResponse.data

  // compute the JWT expiration of i month in seconds
  const jwtOneMonthExpirationInSeconds: number = 30 * 24 * 60 * 60

  // redirect the user to our root page or to the origin page
  const redirectURL = redirectTo ?? new URL('/', request.url)

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=${userJwt}; Path=/; max-age=${jwtOneMonthExpirationInSeconds}`,
    },
  })
}
