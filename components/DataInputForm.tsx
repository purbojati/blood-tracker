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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

// Define the form schema
const formSchema = z.object({
  bloodSugar: z.string().nullable().refine((val) => val === null || val === '' || !isNaN(parseFloat(val)), {
    message: "Blood sugar must be a non-negative number",
  }),
  cholesterol: z.string().nullable().refine((val) => val === null || val === '' || !isNaN(parseFloat(val)), {
    message: "Cholesterol must be a non-negative number",
  }),
  gout: z.string().nullable().refine((val) => val === null || val === '' || !isNaN(parseFloat(val)), {
    message: "Gout level must be a non-negative number",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in HH:MM format",
  }),
})
.refine((data) => {
  return (
    !!data.bloodSugar ||
    !!data.cholesterol ||
    !!data.gout
  );
}, {
  message: 'Please enter at least one value for blood sugar, cholesterol, or uric acid.',
});

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
          blood_sugar: Number(values.bloodSugar) || 0, // Convert to number
          cholesterol: Number(values.cholesterol) || 0, // Convert to number
          gout: Number(values.gout) || 0, // Convert to number
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
              <FormLabel>Blood Glucose</FormLabel>
              <FormControl>
              <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter blood glucose level in mg/dL"
                  {...field}
                  value={field.value ?? ''} // Convert null to empty string
                />
              </FormControl>
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
              <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter cholesterol level in mg/dL"
                  {...field}
                  value={field.value ?? ''} // Convert null to empty string
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uric Acid</FormLabel>
              <FormControl>
              <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter uric acid level in mg/dL"
                  {...field}
                  value={field.value ?? ''} // Convert null to empty string
                />
              </FormControl>
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