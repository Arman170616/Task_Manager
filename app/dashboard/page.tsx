import { Suspense } from "react"
import AuthCheck from "@/components/auth-check"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskProvider } from "@/lib/task-context"

export default function DashboardPage() {
  return (
    <AuthCheck>
      <TaskProvider>
        <div className="mb-8">
          <TaskForm />
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <Suspense fallback={<TaskListSkeleton />}>
              <TaskList completed={false} />
            </Suspense>
          </TabsContent>
          <TabsContent value="completed">
            <Suspense fallback={<TaskListSkeleton />}>
              <TaskList completed={true} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </TaskProvider>
    </AuthCheck>
  )
}

function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

