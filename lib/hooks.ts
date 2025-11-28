"use client"

import { useState, useEffect, useCallback } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Login failed")
    const data = await res.json()
    setUser(data.user)
    return data
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) throw new Error("Signup failed")
    const data = await res.json()
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }, [])

  return { user, loading, login, signup, logout }
}

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch("/api/tasks")
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = useCallback(async (title: string, description: string) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
    if (!res.ok) throw new Error("Failed to create task")
    const data = await res.json()
    setTasks((prev) => [data, ...prev])
    return data
  }, [])

  const updateTask = useCallback(async (id: string, updates: any) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Failed to update task")
    const data = await res.json()
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete task")
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { tasks, loading, fetchTasks, addTask, updateTask, deleteTask }
}
