import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createToken } from "@/lib/jwt"
import { signupSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = signupSchema.parse(body)

    const existingUser = await db.findUserByEmail(validated.email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = await db.createUser(validated.email, validated.password, validated.name)
    const token = createToken(user.id, user.email)

    const response = NextResponse.json(
      {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      },
      { status: 201 },
    )

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
