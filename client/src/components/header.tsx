'use client'

import Link from 'next/link'
import { Button } from './ui/Button'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { ShoppingCart } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Delivering</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component would go here */}
          </div>
          
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/restaurants">Restaurants</Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href="/orders">Orders</Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courier">Courier</Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href="/merchant">Merchant</Link>
            </Button>
            
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            
            <ThemeToggle />
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  )
}
