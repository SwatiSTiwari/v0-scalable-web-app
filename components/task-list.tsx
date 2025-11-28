"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "completed"
  createdAt: string
}

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string, status: "pending" | "completed") => Promise<void>
  onDelete: (id: string) => Promise<void>
  loading?: boolean
}

export function TaskList({ tasks, onToggle, onDelete, loading }: TaskListProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === "all" || task.status === filter
      return matchesSearch && matchesFilter
    })
  }, [tasks, search, filter])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            {["all", "pending", "completed"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status as any)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {search ? "No tasks match your search" : "No tasks yet. Create one to get started!"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() => onToggle(task.id, task.status === "completed" ? "pending" : "completed")}
                  disabled={loading}
                />
                <div className="flex-1 min-w-0">
                  <div className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                    <p className="font-medium">{task.title}</p>
                    {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)} disabled={loading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
