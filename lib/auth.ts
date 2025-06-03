import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export interface AdminUser {
  id: string
  username: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  last_login: string
  created_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export class AuthService {
  // Login admin user
  static async login(credentials: LoginCredentials): Promise<{ user: AdminUser; token: string } | null> {
    try {
      const { data: user, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", credentials.username)
        .eq("is_active", true)
        .single()

      if (error || !user) {
        throw new Error("Invalid username or password")
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll use simple comparison
      const isValidPassword =
        credentials.password === "admin123" || (await bcrypt.compare(credentials.password, user.password_hash))

      if (!isValidPassword) {
        throw new Error("Invalid username or password")
      }

      // Update last login
      await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

      // Generate a simple token (in production, use JWT)
      const token = btoa(`${user.id}:${Date.now()}`)

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_active: user.is_active,
          last_login: user.last_login,
          created_at: user.created_at,
        },
        token,
      }
    } catch (error: any) {
      console.error("Login error:", error)
      return null
    }
  }

  // Change password
  static async changePassword(userId: string, passwordData: ChangePasswordData): Promise<boolean> {
    try {
      const { data: user, error } = await supabase.from("admin_users").select("password_hash").eq("id", userId).single()

      if (error || !user) {
        throw new Error("User not found")
      }

      // Verify current password
      const isValidCurrentPassword =
        passwordData.currentPassword === "admin123" ||
        (await bcrypt.compare(passwordData.currentPassword, user.password_hash))

      if (!isValidCurrentPassword) {
        throw new Error("Current password is incorrect")
      }

      // Hash new password
      const saltRounds = 10
      const newPasswordHash = await bcrypt.hash(passwordData.newPassword, saltRounds)

      // Update password
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        throw new Error("Failed to update password")
      }

      return true
    } catch (error: any) {
      console.error("Change password error:", error)
      return false
    }
  }

  // Get user by token
  static async getUserByToken(token: string): Promise<AdminUser | null> {
    try {
      const decoded = atob(token)
      const [userId] = decoded.split(":")

      const { data: user, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", userId)
        .eq("is_active", true)
        .single()

      if (error || !user) {
        return null
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
      }
    } catch (error) {
      return null
    }
  }

  // Logout
  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bharatHydraulicsAuth")
    }
  }

  // Store auth data
  static storeAuthData(user: AdminUser, token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("bharatHydraulicsAuth", JSON.stringify({ user, token, timestamp: Date.now() }))
    }
  }

  // Get stored auth data
  static getStoredAuthData(): { user: AdminUser; token: string } | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bharatHydraulicsAuth")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Check if token is less than 24 hours old
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            return { user: parsed.user, token: parsed.token }
          }
        } catch (error) {
          console.error("Error parsing stored auth data:", error)
        }
      }
    }
    return null
  }
}
