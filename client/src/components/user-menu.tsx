'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, LogIn, UserPlus, LogOut, Settings, Package, Heart } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
  }

  if (isAuthenticated) {
    return (
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user?.firstName || 'User'}</span>
        </Button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-background border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              
              <Link href="/orders" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                <Package className="h-4 w-4 mr-2" />
                My Orders
              </Link>
              
              <Link href="/favorites" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Link>
              
              <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              
              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">
          <LogIn className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Login</span>
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">
          <UserPlus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Sign Up</span>
        </Link>
      </Button>
    </div>
  )
}
