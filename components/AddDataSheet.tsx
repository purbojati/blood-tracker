'use client';

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DataInputForm } from '@/components/DataInputForm'

export function AddDataSheet() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleFormSubmit = () => {
    // Close the sheet after successful form submission
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Add New Data
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90%]">
        <SheetHeader>
          <SheetTitle>Add New Blood Test Data</SheetTitle>
          <SheetDescription>
            Enter your latest blood test results below.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <DataInputForm onSubmitSuccess={handleFormSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  )
}