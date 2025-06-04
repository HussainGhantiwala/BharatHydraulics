"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Lock, User, Building } from "lucide-react"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

export default function ClientLoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useSupabaseAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await signIn(credentials.email, credentials.password)

      if (error) {
        // Fallback to demo credentials for development
        if (credentials.email === "admin@bharathydraulics.com" && credentials.password === "bharathydraulics2024") {
          localStorage.setItem("client-authenticated", "true")
          router.push("/client")
        } else {
          setError("Invalid credentials. Please try again.")
        }
      } else {
        localStorage.setItem("client-authenticated", "true")
        router.push("/client")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Card className="w-full max-w-md border-teal-200 dark:border-green-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-teal-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-teal-600 dark:text-green-400">Client Portal</CardTitle>
          <p className="text-gray-600 dark:text-gray-300">Bharat Hydraulics & Engineering Co.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-teal-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm text-teal-700 dark:text-green-300 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-teal-600 dark:text-green-400">Email: admin@bharathydraulics.com</p>
            <p className="text-xs text-teal-600 dark:text-green-400">Password: bharathydraulics2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
