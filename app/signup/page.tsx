"use client"

import { AuthForm } from "@/components/auth-form"

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <AuthForm mode="signup" />
    </main>
  )
}
