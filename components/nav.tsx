'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'History', icon: History },
    { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            AI Writing Assistant
          </Link>
          <div className="flex items-center gap-4">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
