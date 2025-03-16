import AuthCheck from "@/components/auth-check"
import ProfileForm from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <AuthCheck>
      <div className="max-w-md mx-auto">
        
        <ProfileForm />
      </div>
    </AuthCheck>
  )
}

