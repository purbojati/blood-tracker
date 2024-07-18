import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TopNavProps {
  title: string;
  backLink?: string;
}

export const TopNav = ({ title, backLink }: TopNavProps) => {
  return (
    <header className="flex items-center h-14 px-4 border-b bg-background">
      {backLink && (
        <Link href={backLink}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
      )}
      <h1 className="text-lg font-bold text-foreground text-center">{title}</h1>
    </header>
  )
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}