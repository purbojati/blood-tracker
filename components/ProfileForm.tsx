'use client';

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from 'react-hook-form'

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
  const form = useForm<ProfileForm>({
    defaultValues: {
      id: '',
      name: '',
      age: 0,
      gender: '',
      country: '',
      language: '',
    },
  })

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
        form.reset(data)
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
      console.log('Profile updated:', data)
      toast({
        description: 'Profile updated',
      })
      // Reset the form after successful update
      if (data) {
        form.reset(data[0])
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
              <Input placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Age" value={profile.age} onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select
                  value={profile.gender || ''}
                  onValueChange={(value) => {
                    setProfile({ ...profile, gender: value })
                    form.setValue('gender', value)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="Language" value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Update Profile</Button>
      </form>
    </Form>
  )
}