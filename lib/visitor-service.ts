import { supabase } from "@/lib/supabase"

export interface VisitorData {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  interests?: string
}

export interface VisitorSession {
  id: string
  customer_id: string
  session_id?: string
  ip_address?: string
  user_agent?: string
  page_visited?: string
  referrer?: string
  visit_duration?: number
  created_at: string
}

export interface VisitorWithSessions {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  created_at: string
  sessions: VisitorSession[]
  total_visits: number
  last_visit: string
}

export class VisitorService {
  // Register a new visitor
  static async registerVisitor(visitorData: VisitorData): Promise<string | null> {
    try {
      // Check if visitor already exists
      const { data: existingVisitor } = await supabase
        .from("customers")
        .select("id")
        .eq("email", visitorData.email)
        .single()

      if (existingVisitor) {
        // Update existing visitor
        const { error: updateError } = await supabase
          .from("customers")
          .update({
            name: visitorData.name,
            phone: visitorData.phone,
            company: visitorData.company,
            address: visitorData.address,
          })
          .eq("id", existingVisitor.id)

        if (updateError) throw updateError
        return existingVisitor.id
      }

      // Create new visitor
      const { data: newVisitor, error } = await supabase
        .from("customers")
        .insert([
          {
            name: visitorData.name,
            email: visitorData.email,
            phone: visitorData.phone,
            company: visitorData.company,
            address: visitorData.address,
          },
        ])
        .select("id")
        .single()

      if (error) throw error
      return newVisitor.id
    } catch (error: any) {
      console.error("Error registering visitor:", error)
      return null
    }
  }

  // Track visitor session
  static async trackVisitorSession(
    customerId: string,
    sessionData: {
      sessionId?: string
      ipAddress?: string
      userAgent?: string
      pageVisited?: string
      referrer?: string
    },
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("visitor_sessions").insert([
        {
          customer_id: customerId,
          session_id: sessionData.sessionId,
          ip_address: sessionData.ipAddress,
          user_agent: sessionData.userAgent,
          page_visited: sessionData.pageVisited,
          referrer: sessionData.referrer,
        },
      ])

      if (error) throw error
      return true
    } catch (error: any) {
      console.error("Error tracking visitor session:", error)
      return false
    }
  }

  // Get all visitors with session data (admin only)
  static async getVisitorsWithSessions(): Promise<VisitorWithSessions[]> {
    try {
      // Get all customers
      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })

      if (customersError) throw customersError

      // Get session data for each customer
      const visitorsWithSessions: VisitorWithSessions[] = []

      for (const customer of customers || []) {
        const { data: sessions, error: sessionsError } = await supabase
          .from("visitor_sessions")
          .select("*")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })

        if (sessionsError) {
          console.error("Error fetching sessions for customer:", customer.id, sessionsError)
          continue
        }

        const lastVisit = sessions && sessions.length > 0 ? sessions[0].created_at : customer.created_at

        visitorsWithSessions.push({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          address: customer.address,
          created_at: customer.created_at,
          sessions: sessions || [],
          total_visits: (sessions || []).length,
          last_visit: lastVisit,
        })
      }

      return visitorsWithSessions
    } catch (error: any) {
      console.error("Error fetching visitors with sessions:", error)
      return []
    }
  }

  // Get visitor analytics
  static async getVisitorAnalytics(): Promise<{
    totalVisitors: number
    newVisitorsToday: number
    totalSessions: number
    averageSessionsPerVisitor: number
  }> {
    try {
      // Get total visitors
      const { count: totalVisitors } = await supabase.from("customers").select("*", { count: "exact", head: true })

      // Get new visitors today
      const today = new Date().toISOString().split("T")[0]
      const { count: newVisitorsToday } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${today}T00:00:00.000Z`)
        .lt("created_at", `${today}T23:59:59.999Z`)

      // Get total sessions
      const { count: totalSessions } = await supabase
        .from("visitor_sessions")
        .select("*", { count: "exact", head: true })

      const averageSessionsPerVisitor = totalVisitors ? (totalSessions || 0) / totalVisitors : 0

      return {
        totalVisitors: totalVisitors || 0,
        newVisitorsToday: newVisitorsToday || 0,
        totalSessions: totalSessions || 0,
        averageSessionsPerVisitor: Math.round(averageSessionsPerVisitor * 100) / 100,
      }
    } catch (error: any) {
      console.error("Error fetching visitor analytics:", error)
      return {
        totalVisitors: 0,
        newVisitorsToday: 0,
        totalSessions: 0,
        averageSessionsPerVisitor: 0,
      }
    }
  }
}
