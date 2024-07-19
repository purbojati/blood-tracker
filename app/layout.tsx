import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNavigation } from '@/components/BottomNavigation'
import { Toaster } from "@/components/ui/toaster"
import { InstallPWA } from '@/components/InstallPWA'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'Blood Tracker AI',
  description: 'Track your blood metrics with AI assistance',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/icon-192x192.png' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        style={{
          'user-select': 'none',
          '-webkit-user-select': 'none',
          '-khtml-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          '-webkit-tap-highlight-color': 'transparent',
        } as React.CSSProperties}
      >
        <main>
          {children}
        </main>
        <InstallPWA />
        <Toaster />
        <BottomNavigation />
      </body>
    </html>
  );
}
