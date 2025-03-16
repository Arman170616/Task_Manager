"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm() {
  // Start with null state to avoid hydration mismatch
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [formData, setFormData] = useState<{ username: string; password: string } | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize client-side state after mount
  useEffect(() => {
    setIsLoading(false)
    setFormData({ username: "", password: "" })
    setIsMounted(true)
  }, [])

  // Don't render form content until client-side initialization is complete
  if (!isMounted || formData === null) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <div className="h-5"></div>
            <div className="h-10"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5"></div>
            <div className="h-10"></div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="w-full h-10"></div>
          <div className="text-center text-sm h-5"></div>
        </CardFooter>
      </Card>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : { username: "", password: "" }))
  }

  // Update the handleSubmit function to properly handle authentication and navigation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.access)
      localStorage.setItem("refreshToken", data.refresh)

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      // Force a hard navigation to dashboard to ensure a full page load
      window.location.href = "/dashboard"
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading === true}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

