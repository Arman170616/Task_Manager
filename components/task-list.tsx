"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import { useTaskContext } from "@/lib/task-context"

interface Task {
  id: number
  title: string
  completed: boolean
  created_at: string
  completed_at: string | null
}

export default function TaskList({ completed }: { completed: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const { toast } = useToast()
  const { shouldRefresh, setShouldRefresh } = useTaskContext()

  useEffect(() => {
    fetchTasks()
  }, [completed, shouldRefresh])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`http://localhost:8000/api/tasks/?completed=${completed}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      setTasks(data)

      // Reset the refresh flag after fetching
      if (shouldRefresh) {
        setShouldRefresh(false)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Failed to load tasks",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed",
        description: task.completed
          ? "The task has been moved to current tasks."
          : "The task has been moved to completed tasks.",
      })

      // Trigger refresh for both task lists
      setShouldRefresh(true)
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })

      // Remove the task from the list
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      toast({
        title: "Failed to delete task",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = async () => {
    if (!editTask || !editTitle.trim()) return

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`http://localhost:8000/api/tasks/${editTask.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      })

      // Update the task in the list
      setTasks(tasks.map((task) => (task.id === editTask.id ? { ...task, title: editTitle } : task)))

      setEditTask(null)
      setEditTitle("")
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <p className="text-center py-8">Loading tasks...</p>
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        {completed ? "No completed tasks yet." : "No tasks yet. Add a new task above."}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleToggleComplete(task)}
              id={`task-${task.id}`}
            />
            <div className="flex-1">
              <label
                htmlFor={`task-${task.id}`}
                className={`font-medium ${task.completed ? "line-through text-slate-500" : ""}`}
              >
                {task.title}
              </label>
              <p className="text-xs text-slate-500">
                {task.completed
                  ? `Completed on ${format(new Date(task.completed_at!), "MMM d, yyyy")}`
                  : `Created on ${format(new Date(task.created_at), "MMM d, yyyy")}`}
              </p>
            </div>

            {!task.completed && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditTask(task)
                      setEditTitle(task.title)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit task</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Task title" />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleEditTask}>Save Changes</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

