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
        <Button variant="outline">Add New Data</Button>
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