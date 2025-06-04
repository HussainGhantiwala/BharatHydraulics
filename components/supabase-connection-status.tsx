"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { testSupabaseConnection } from "@/lib/supabase-client"

export function SupabaseConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean | null
    error: string | null
    loading: boolean
  }>({
    connected: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus((prev) => ({ ...prev, loading: true }))

      try {
        const result = await testSupabaseConnection()
        setConnectionStatus({
          connected: result.connected,
          error: result.error,
          loading: false,
        })
      } catch (error) {
        setConnectionStatus({
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        })
      }
    }

    checkConnection()

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  if (connectionStatus.loading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking connection...
      </Badge>
    )
  }

  if (connectionStatus.connected) {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
        <CheckCircle className="h-3 w-3" />
        Supabase Connected
      </Badge>
    )
  }

  return (
    <div className="space-y-2">
      <Badge variant="destructive" className="flex items-center gap-2">
        <XCircle className="h-3 w-3" />
        Supabase Disconnected
      </Badge>
      {connectionStatus.error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertDescription className="text-red-600 dark:text-red-400 text-xs">
            {connectionStatus.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
