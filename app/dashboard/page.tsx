'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MetricChart } from '@/components/MetricChart'
import { AddDataSheet } from '@/components/AddDataSheet'
import { TopNav } from '@/components/TopNav'

type BloodTestData = {
  date: string
  value: number
}

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [bloodSugarData, setBloodSugarData] = useState<BloodTestData[]>([])
  const [cholesterolData, setCholesterolData] = useState<BloodTestData[]>([])
  const [goutData, setGoutData] = useState<BloodTestData[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // router.push('/login')
        // return
      }

      try {
        const { data, error } = await supabase
          .from('blood_tests')
          .select('*')
          .eq('user_id', user?.id)
          .order('test_date', { ascending: false })
          .limit(7)
        if (error) throw error

        if (data) {
          const formattedData = data.reverse().map(test => ({
            date: new Date(test.test_date).toISOString().split('T')[0],
            bloodSugar: test.blood_sugar,
            cholesterol: test.cholesterol,
            gout: test.gout
          }))

          setBloodSugarData(formattedData.map(d => ({ date: d.date, value: d.bloodSugar })))
          setCholesterolData(formattedData.map(d => ({ date: d.date, value: d.cholesterol })))
          setGoutData(formattedData.map(d => ({ date: d.date, value: d.gout })))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndFetchData()

    // Add real-time subscription
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'blood_tests' },
        () => checkUserAndFetchData()
      )
      .subscribe()

    // Remove subscription when component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const calculateTrend = (data: BloodTestData[]) => {
    if (data.length < 2) return 0
    const lastValue = data[data.length - 1].value
    const previousValue = data[data.length - 2].value
    return ((lastValue - previousValue) / previousValue) * 100
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <TopNav title="Dashboard" />
      <div className="grid grid-cols-1 mx-4 mt-4">
        <AddDataSheet />
      </div>
      <div className="grid gap-4 p-4 mb-16">
        <MetricChart
          title="🩸 Blood Glucose"
          data={bloodSugarData}
          color="hsl(var(--chart-1))"
          unit="mg/dL"
          trend={calculateTrend(bloodSugarData)}
          description="Blood Glucose Level"
        />
        <MetricChart
          title="🫀 Cholesterol"
          data={cholesterolData}
          color="hsl(var(--chart-2))"
          unit="mg/dL"
          trend={calculateTrend(cholesterolData)}
          description="Cholesterol Level"
        />
        <MetricChart
          title="🦶 Uric Acid"
          data={goutData}
          color="hsl(var(--chart-3))"
          unit="mg/dL"
          trend={calculateTrend(goutData)}
          description="Uric Acid Level"
        />
      </div>
    </div>
  )
}
