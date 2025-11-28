import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { taskSchema } from "@/lib/validation"

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request.headers.get("Authorization") || "", request.headers.get("Cookie") || "")

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tasks = await db.getTasksByUser(user.userId)
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser(request.headers.get("Authorization") || "", request.headers.get("Cookie") || "")

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validated = taskSchema.parse(body)

    const task = await db.createTask(user.userId, validated.title, validated.description)
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
