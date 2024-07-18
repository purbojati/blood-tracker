'use client';

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface ProfileForm {
  id: string;
  name: string;
  age: number;
  gender: string;
  country: string;
  language: string;
}

export function ProfileForm() {
  const [profile, setProfile] = useState<ProfileForm>({
    id: '',
    name: '',
    age: 0,
    gender: '',
    country: '',
    language: '',
  })

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else if (data) {
        setProfile(data)
      }
    }

    fetchProfile()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })

    if (error) {
      console.error('Error updating profile:', error)
      toast({
        description: 'Error updating profile',
        variant: 'destructive',
      })
    } else {
      console.log('Profile updated successfully:', data)
      toast({
        description: 'Profile updated successfully',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Age"
        value={profile.age}
        onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
      />
      <Select
        value={profile.gender || ''}
        onValueChange={(value) => setProfile({ ...profile, gender: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Country"
        value={profile.country}
        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
      />
      <Input
        placeholder="Language"
        value={profile.language}
        onChange={(e) => setProfile({ ...profile, language: e.target.value })}
      />
      <Button type="submit">Update Profile</Button>
    </form>
  )
}