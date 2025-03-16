"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from "lucide-react"
import { useTaskContext } from "@/lib/task-context"

export default function TaskForm() {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { refreshTasks } = useTaskContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      // Get the newly created task data
      const newTask = await response.json()

      setTitle("")
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      })

      // Trigger task list refresh
      refreshTasks()
    } catch (error) {
      toast({
        title: "Failed to create task",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <Input
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading || !title.trim()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

