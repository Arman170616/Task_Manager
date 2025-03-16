import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-slate-900">TaskMaster</h1>
        <LoginForm />
      </div>
    </div>
  )
}

