'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Delicious Food, Delivered Fast
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Order from your favorite restaurants and get it delivered to your doorstep
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Enter your delivery address"
                  className="pl-10 h-12 text-gray-900"
                />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for restaurants or food"
                  className="pl-10 h-12 text-gray-900"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Find Food
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
