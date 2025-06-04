"use client"

import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured, type QuotationRequest, type FollowUp } from "@/lib/supabase"

export function useSupabaseQuotations() {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotations()
    fetchFollowUps()
  }, [])

  const fetchQuotations = async () => {
    try {
      setLoading(true)

      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error("Supabase not configured")
      }

      const { data, error } = await supabase
        .from("quotation_requests")
        .select(`
        *,
        product:products(*)
      `)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Supabase quotations table not found, using localStorage fallback:", error.message)
        throw error
      }
      setQuotations(data || [])
    } catch (error) {
      console.warn("Using localStorage fallback for quotations")
      // Fallback to localStorage
      const savedQuotations = localStorage.getItem("quotation-requests")
      if (savedQuotations) {
        setQuotations(JSON.parse(savedQuotations))
      } else {
        setQuotations([])
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchFollowUps = async () => {
    try {
      const { data, error } = await supabase.from("follow_ups").select("*").order("follow_up_date", { ascending: true })

      if (error) {
        console.warn("Supabase follow_ups table not found:", error.message)
        throw error
      }
      setFollowUps(data || [])
    } catch (error) {
      console.warn("Using localStorage fallback for follow-ups")
      // Fallback to empty array for follow-ups
      setFollowUps([])
    }
  }

  const addQuotationRequest = async (quotationData: Omit<QuotationRequest, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase.from("quotation_requests").insert([quotationData]).select().single()

      if (error) {
        console.warn("Supabase insert failed, using localStorage:", error.message)
        throw error
      }
      await fetchQuotations() // Refresh to get product data
      return { data, error: null }
    } catch (error) {
      console.warn("Using localStorage fallback for adding quotation")
      // Fallback to localStorage
      const newQuotation = {
        ...quotationData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const existingQuotations = JSON.parse(localStorage.getItem("quotation-requests") || "[]")
      const updatedQuotations = [newQuotation, ...existingQuotations]
      setQuotations(updatedQuotations)
      localStorage.setItem("quotation-requests", JSON.stringify(updatedQuotations))
      return { data: newQuotation, error: null }
    }
  }

  const updateQuotationStatus = async (id: string, status: QuotationRequest["status"]) => {
    try {
      const { data, error } = await supabase
        .from("quotation_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
      return { data, error: null }
    } catch (error) {
      console.error("Error updating quotation status:", error)
      return { data: null, error }
    }
  }

  const addFollowUp = async (followUpData: Omit<FollowUp, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase.from("follow_ups").insert([followUpData]).select().single()

      if (error) throw error
      setFollowUps((prev) => [...prev, data])
      return { data, error: null }
    } catch (error) {
      console.error("Error adding follow-up:", error)
      return { data: null, error }
    }
  }

  const markFollowUpCompleted = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("follow_ups")
        .update({ completed: true })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, completed: true } : f)))
      return { data, error: null }
    } catch (error) {
      console.error("Error marking follow-up completed:", error)
      return { data: null, error }
    }
  }

  return {
    quotations,
    followUps,
    loading,
    addQuotationRequest,
    updateQuotationStatus,
    addFollowUp,
    markFollowUpCompleted,
    refetch: fetchQuotations,
  }
}
