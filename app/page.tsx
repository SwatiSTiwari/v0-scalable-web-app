"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center space-y-6 max-w-md">
        <div>
          <h1 className="text-4xl font-bold text-balance">Scalable Web App</h1>
          <p className="text-lg text-muted-foreground mt-2">Build, manage, and scale with confidence</p>
        </div>

        <div className="space-y-3">
          <p className="text-muted-foreground">
            Get started with authentication and a powerful dashboard to manage your tasks.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push("/login")} size="lg">
            Login
          </Button>
          <Button onClick={() => router.push("/signup")} variant="outline" size="lg">
            Sign Up
          </Button>
        </div>

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <p>Demo credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: demo@123</p>
        </div>
      </div>
    </main>
  )
}
