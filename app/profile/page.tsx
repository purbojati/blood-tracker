import { ProfileForm } from '@/components/ProfileForm'
import { TopNav } from '@/components/TopNav'

export default function Profile() {
  return (
    <div>
      <TopNav title="Profile" />
      <div className="p-4 space-y-6">
        <ProfileForm />
      </div>
    </div>
  )
}