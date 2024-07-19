'use client';

import useSWR from 'swr'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import BloodTest  from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { TopNav } from '@/components/TopNav'

const fetcher = async () => {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('blood_tests')
    .select('*')
    .eq('user_id', user.id)
    .order('test_date', { ascending: false })
    .limit(30) // Limit to the last 30 entries

  if (error) throw error
  return data
}

export default function History() {
  const { data: tests, error } = useSWR<BloodTest[]>('blood_tests', fetcher)

  if (error) return <div>Failed to load</div>
  if (!tests) return <div>Loading...</div>
  if (tests.length === 0) return (
    <div>
      <TopNav title="Test History" />
      <div className="text-center">
        <h2 className="text-lg font-bold mt-20 mb-4">No Test History Available</h2>
        <p className="mb-4 text-sm px-4 text-slate-500">It looks like you havent added any blood test records yet. Start tracking your health by adding your first record!</p>
      
      </div>
    </div>
  );

  return (
    <div>
      <TopNav title="Test History" />
      <div className="grid gap-4 p-4">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardContent>
                <div className="grid items-center text-sm my-2 gap-2">
                  <span className=" text-slate-500"></span> {new Date(test.test_date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">Blood Sugar:</span><br/> {test.blood_sugar} mg/dL
                </div>
                <div>
                  <span className="font-medium">Cholesterol:</span><br/>{test.cholesterol} mg/dL
                </div>
                <div>
                  <span className="font-medium">Gout:</span><br/>{test.gout} mg/dL
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}