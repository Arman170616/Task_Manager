"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  username: string
  email: string
  profile_picture: string | null
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          router.push("/")
          return
        }

        const response = await fetch("http://localhost:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile({
          username: data.username,
          email: data.email,
          profile_picture: data.profile_picture ? `http://localhost:8000${data.profile_picture}` : null,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router, toast])

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("profile_picture", file)

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/upload-profile-picture/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload profile picture")
      }

      const data = await response.json()
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              profile_picture: `http://localhost:8000${data.profile_picture}`,
            }
          : null,
      )

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  if (!profile) {
    return <div className="text-center py-8">Failed to load profile</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.profile_picture || ""} alt={profile.username} />
            <AvatarFallback>{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 w-full max-w-xs">
            <Label htmlFor="profile-picture">Profile Picture</Label>
            <Input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-center">Uploading...</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Username</Label>
          <Input value={profile.username} disabled />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={profile.email} disabled />
        </div>

        <Button onClick={() => router.push("/dashboard")} className="w-full">
          Back to Dashboard
        </Button>
      </CardContent>
    </Card>
  )
}

