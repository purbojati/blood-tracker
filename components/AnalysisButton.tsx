'use client';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalysisResult {
  bloodSugar: {
    status: 'Normal' | 'Elevated' | 'High' | 'Low',
    value: number,
    recommendation: string
  },
  cholesterol: {
    status: 'Normal' | 'Borderline High' | 'High',
    value: number,
    recommendation: string
  },
  gout: {
    status: 'Normal' | 'Elevated' | 'High',
    value: number,
    recommendation: string
  },
  overallHealth: string,
  lifestyle: string[]
}

export function AnalysisButton() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleAnalysis = async () => {
    setIsLoading(true)
    const supabase = createClientComponentClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('User not authenticated. Please sign in.')
        return
      }

      const response = await fetch(`/api/analysis?userId=${user.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalysis(data.analysis)
        setIsOpen(true)  // Open the drawer when analysis is ready
      } else {
        alert('Failed to get analysis. Please try again.')
      }
    } catch (error) {
      console.error('Error during analysis:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-green-500'
      case 'Elevated': case 'Borderline High': return 'text-yellow-500'
      case 'High': case 'Low': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Get AI Analysis'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>AI Analysis Results</DrawerTitle>
          <DrawerDescription>
            Based on your recent blood test data
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0 overflow-y-auto max-h-[70vh]">
          {analysis && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🩸 Blood Sugar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`font-bold ${getStatusColor(analysis.bloodSugar.status)}`}>
                      {analysis.bloodSugar.status} ({analysis.bloodSugar.value} mg/dL)
                    </p>
                    <p className="text-sm mt-2">{analysis.bloodSugar.recommendation}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🫀 Cholesterol</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`font-bold ${getStatusColor(analysis.cholesterol.status)}`}>
                      {analysis.cholesterol.status} ({analysis.cholesterol.value} mg/dL)
                    </p>
                    <p className="text-sm mt-2">{analysis.cholesterol.recommendation}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🦶 Gout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`font-bold ${getStatusColor(analysis.gout.status)}`}>
                      {analysis.gout.status} ({analysis.gout.value} mg/dL)
                    </p>
                    <p className="text-sm mt-2">{analysis.gout.recommendation}</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">🏥 Overall Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{analysis.overallHealth}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🌿 Lifestyle Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5">
                    {analysis.lifestyle.map((recommendation, index) => (
                      <li key={index} className="text-sm mb-1">{recommendation}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}