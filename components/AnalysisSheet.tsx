'use client';

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"

interface AnalysisSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Array<{ date: string; value: number }>;
  unit: string;
}

export function AnalysisSheet({ isOpen, onClose, title, data, unit }: AnalysisSheetProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAnalysis()
    } else {
      // Reset states when sheet is closed
      setAnalysis(null)
      setRecommendation(null)
      setError(null)
    }
  }, [isOpen])

  const fetchAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate API call with mock data
      const mockAnalysis = `Your latest ${title} reading is ${data[data.length - 1].value} ${unit}, which is within the normal range. The trend of your ${title} levels has been stable.`;
      const mockRecommendation = `Maintain a balanced diet, regular exercise, and continue monitoring your ${title}.`;
      setAnalysis(mockAnalysis)
      setRecommendation(mockRecommendation)
    } catch (error) {
      console.error('Error fetching analysis:', error)
      setError('Failed to fetch analysis. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getLatestTrend = () => {
    if (data.length < 2) return 0
    const latestValue = data[data.length - 1].value
    const previousValue = data[data.length - 2].value
    return ((latestValue - previousValue) / previousValue) * 100
  }
  const trend = getLatestTrend()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90%] sm:h-[85%] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{title} Analysis</SheetTitle>
          <SheetDescription>Based on your profile and recent measurements</SheetDescription>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Analyzing your data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Latest {title}</p>
                {/* Check if data is available before accessing the last element */}
                <p className="text-2xl font-bold">{data.length > 0 ? data[data.length - 1].value : 0} {unit}</p>
              </div>
              <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <TrendingUp className="mr-1" /> : <TrendingDown className="mr-1" />}
                <span className="font-medium">{Math.abs(trend).toFixed(1)}%</span>
              </div>
            </div>
            
            {analysis && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Analysis</h3>
                <p className="text-sm text-muted-foreground">{analysis}</p>
              </div>
            )}
            
            {recommendation && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Recommendations</h3>
                <p className="text-sm text-muted-foreground">{recommendation}</p>
              </div>
            )}
            
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
