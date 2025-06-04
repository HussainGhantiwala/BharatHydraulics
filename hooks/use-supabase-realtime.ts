"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useSupabaseRealtime() {
  const [isConnected, setIsConnected] = useState(false)
  const [channels, setChannels] = useState<RealtimeChannel[]>([])

  useEffect(() => {
    // Subscribe to realtime connection status
    const channel = supabase.channel("connection-status")

    channel
      .on("system", {}, (payload) => {
        if (payload.type === "connected") {
          setIsConnected(true)
        } else if (payload.type === "disconnected") {
          setIsConnected(false)
        }
      })
      .subscribe()

    setChannels([channel])

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const subscribeToTable = (tableName: string, callback: (payload: any) => void, filter?: string) => {
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
          filter: filter,
        },
        callback,
      )
      .subscribe()

    setChannels((prev) => [...prev, channel])
    return channel
  }

  const unsubscribeAll = () => {
    channels.forEach((channel) => channel.unsubscribe())
    setChannels([])
  }

  return {
    isConnected,
    subscribeToTable,
    unsubscribeAll,
  }
}
