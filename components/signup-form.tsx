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

export default function SignupForm() {
  // Start with null state to avoid hydration mismatch
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [formData, setFormData] = useState<{
    username: string
    email: string
    password: string
    password2: string
  } | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize client-side state after mount
  useEffect(() => {
    setIsLoading(false)
    setFormData({ username: "", email: "", password: "", password2: "" })
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
    setFormData((prev) =>
      prev ? { ...prev, [name]: value } : { username: "", email: "", password: "", password2: "" },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.password2) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Registration failed")
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
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
              placeholder="Choose a username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password2">Confirm Password</Label>
            <Input
              id="password2"
              name="password2"
              type="password"
              placeholder="Confirm your password"
              required
              value={formData.password2}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading === true}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

