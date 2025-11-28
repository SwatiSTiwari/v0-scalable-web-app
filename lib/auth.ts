import { verifyToken } from "./jwt"

export function getTokenFromCookie(cookie: string | undefined): string | null {
  if (!cookie) return null
  const cookies = cookie.split(";").map((c) => c.trim())
  for (const c of cookies) {
    if (c.startsWith("auth_token=")) {
      return c.substring("auth_token=".length)
    }
  }
  return null
}

export function parseAuthHeader(header: string | undefined): string | null {
  if (!header || !header.startsWith("Bearer ")) return null
  return header.substring("Bearer ".length)
}

export function getCurrentUser(authHeader: string | undefined, cookie: string | undefined) {
  const token = parseAuthHeader(authHeader) || getTokenFromCookie(cookie)
  if (!token) return null
  return verifyToken(token)
}
