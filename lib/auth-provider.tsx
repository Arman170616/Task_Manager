"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string, refreshToken: string) => void
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem("accessToken")
    setIsAuthenticated(!!token)
  }, [])

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("refreshToken", refreshToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setIsAuthenticated(false)
    router.push("/")
  }

  const getToken = () => {
    return localStorage.getItem("accessToken")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

