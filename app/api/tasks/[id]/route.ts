import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { taskSchema } from "@/lib/validation"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = getCurrentUser(request.headers.get("Authorization") || "", request.headers.get("Cookie") || "")

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const task = await db.getTaskById(id)
    if (!task || task.userId !== user.userId) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = getCurrentUser(request.headers.get("Authorization") || "", request.headers.get("Cookie") || "")

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const task = await db.getTaskById(id)
    if (!task || task.userId !== user.userId) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const body = await request.json()
    const updates = taskSchema.partial().parse(body)

    const updated = await db.updateTask(id, updates)
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = getCurrentUser(request.headers.get("Authorization") || "", request.headers.get("Cookie") || "")

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const task = await db.getTaskById(id)
    if (!task || task.userId !== user.userId) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await db.deleteTask(id)
    return NextResponse.json({ message: "Task deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
