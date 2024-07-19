import { ProfileForm } from '@/components/ProfileForm'
import { TopNav } from '@/components/TopNav'
import { AuthButton } from '@/components/AuthButton'

export default function Profile() {
  return (
    <div>
      <TopNav title="Profile" />
      <div className="p-4 space-y-6">
        <ProfileForm />
        <AuthButton />
      </div>
    </div>
  )
}