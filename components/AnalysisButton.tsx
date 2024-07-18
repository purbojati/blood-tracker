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
import ReactMarkdown from 'react-markdown'
import { Loader2 } from 'lucide-react'

export function AnalysisButton() {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    setAnalysis(null)
    setIsOpen(true)
    const supabase = createClientComponentClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('User not authenticated. Please sign in.')
        return
      }

      const response = await fetch(`/api/analysis?userId=${user.id}`)
      const data = await response.json()
      
      if (response.ok && data.analysis) {
        const mdxContent = convertToMDX(data.analysis)
        setAnalysis(mdxContent)
      } else {
        setError(data.error || 'Failed to get analysis. Please try again.')
      }
    } catch (error) {
      console.error('Error during analysis:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const convertToMDX = (text: string) => {
    // This function converts the plain text to an MDX-like format
    // You may need to adjust this based on the actual structure of your AI's response
    const sections = text.split('\n\n')
    return sections.map(section => {
      if (section.startsWith('Blood Sugar') || section.startsWith('Cholesterol') || section.startsWith('Gout')) {
        return `## ${section}\n`
      } else if (section.startsWith('Overall Health')) {
        return `## Overall Health Assessment\n\n${section.split(':')[1].trim()}\n`
      } else if (section.startsWith('Lifestyle Recommendations')) {
        const recommendations = section.split(':')[1].trim().split('\n')
        return `## Lifestyle Recommendations\n\n${recommendations.map(rec => `- ${rec.trim()}\n`).join('')}`
      }
      return section
    }).join('\n\n')
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
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Generating your personalized health analysis...
                <br />
                This may take a few moments.
              </p>
            </div>
          )}
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          {analysis && !isLoading && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          )}
          {!analysis && !error && !isLoading && (
            <p>No analysis data available. Try running the analysis again.</p>
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