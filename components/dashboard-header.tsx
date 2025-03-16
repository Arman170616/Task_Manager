"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

export default function DashboardHeader() {
  const [username, setUsername] = useState("")
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          console.log("No token found, redirecting to login")
          router.push("/")
          return
        }

        const response = await fetch("http://localhost:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.error("Profile fetch failed:", response.status)
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            router.push("/")
            return
          }
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setUsername(data.username)
        if (data.profile_picture) {
          setProfilePic(`http://localhost:8000${data.profile_picture}`)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchUserProfile()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    // Force a hard navigation to ensure a full page reload
    window.location.href = "/"
  }

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
      setProfilePic(`http://localhost:8000${data.profile_picture}`)

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">TaskMaster</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profilePic || ""} alt={username} />
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{username}</p>
              </div>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Change Profile Picture</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {profilePic && (
                    <div className="flex justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profilePic} alt={username} />
                        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="picture">Upload a new picture</Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

