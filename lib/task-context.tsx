"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type TaskContextType = {
  shouldRefresh: boolean
  setShouldRefresh: (value: boolean) => void
  refreshTasks: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [shouldRefresh, setShouldRefresh] = useState(false)

  const refreshTasks = () => {
    setShouldRefresh(true)
  }

  return (
    <TaskContext.Provider value={{ shouldRefresh, setShouldRefresh, refreshTasks }}>{children}</TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

