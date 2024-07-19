'use client';

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

// Define the form schema
const formSchema = z.object({
  bloodSugar: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Blood sugar must be a positive number",
  }),
  cholesterol: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Cholesterol must be a positive number",
  }),
  gout: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Gout level must be a positive number",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in HH:MM format",
  }),
})

interface DataInputFormProps {
  onSubmitSuccess?: () => void;
}

export function DataInputForm({ onSubmitSuccess }: DataInputFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodSugar: "",
      cholesterol: "",
      gout: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from('blood_tests')
        .insert({
          user_id: user.id,
          blood_sugar: parseFloat(values.bloodSugar),
          cholesterol: parseFloat(values.cholesterol),
          gout: parseFloat(values.gout),
          test_date: `${values.date}T${values.time}:00`,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Blood test data submitted successfully.",
      })
      form.reset()
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (error) {
      console.error('Error submitting data:', error)
      toast({
        title: "Error",
        description: "Failed to submit blood test data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bloodSugar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Sugar</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter blood sugar level" {...field} />
              </FormControl>
              <FormDescription>Enter your blood sugar level in mg/dL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cholesterol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cholesterol</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter cholesterol level" {...field} />
              </FormControl>
              <FormDescription>Enter your cholesterol level in mg/dL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gout</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter gout level" {...field} />
              </FormControl>
              <FormDescription>Enter your gout level in mg/dL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}