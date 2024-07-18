'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, History, UserCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'History', href: '/history', icon: History },
  { name: 'Profile', href: '/profile', icon: UserCircle },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 text-sm",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}