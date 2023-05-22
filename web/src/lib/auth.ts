import { cookies } from 'next/headers'
import decode from 'jwt-decode'

interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getUserFromJwt(): User {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Jwt not Found')
  }

  const user: User = decode(token)

  return user
}
