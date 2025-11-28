// Simple JWT implementation for demo
// In production, use a proper JWT library like jsonwebtoken

const SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

interface Payload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

function base64Encode(str: string): string {
  return Buffer.from(str).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function base64Decode(str: string): string {
  const padding = 4 - (str.length % 4)
  const padded = str + "=".repeat(padding === 4 ? 0 : padding)
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
}

export function createToken(userId: string, email: string): string {
  const header = base64Encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const now = Math.floor(Date.now() / 1000)
  const payload = base64Encode(
    JSON.stringify({
      userId,
      email,
      iat: now,
      exp: now + 24 * 60 * 60, // 24 hours
    }),
  )
  const signature = base64Encode(
    require("crypto").createHmac("sha256", SECRET).update(`${header}.${payload}`).digest("hex"),
  )
  return `${header}.${payload}.${signature}`
}

export function verifyToken(token: string): Payload | null {
  try {
    const [header, payload, signature] = token.split(".")
    const now = Math.floor(Date.now() / 1000)
    const data = JSON.parse(base64Decode(payload))
    if (data.exp && data.exp < now) return null
    return data
  } catch {
    return null
  }
}
