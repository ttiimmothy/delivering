'use client'

import { useState } from 'react'
import { MapPin, Clock, DollarSign, Star, CheckCircle, Truck, User, Phone, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for courier dashboard
const mockStats = {
  totalDeliveries: 127,
  totalEarnings: 2847.50,
  averageRating: 4.8,
  activeHours: 32
}

const mockDeliveries = [
  {
    id: 'DEL-001',
    restaurant: 'Bella Vista Italian',
    customer: 'John Smith',
    address: '123 Main St, Apt 4B',
    distance: '2.3 mi',
    estimatedTime: '15 min',
    earnings: 8.50,
    status: 'in_progress',
    orderTime: '2024-01-16T14:30:00Z',
    pickupTime: '2024-01-16T14:45:00Z',
    estimatedDelivery: '2024-01-16T15:00:00Z'
  },
  {
    id: 'DEL-002',
    restaurant: 'Sushi Zen',
    customer: 'Sarah Johnson',
    address: '456 Oak Ave, Unit 2',
    distance: '1.8 mi',
    estimatedTime: '12 min',
    earnings: 7.25,
    status: 'completed',
    orderTime: '2024-01-16T13:15:00Z',
    pickupTime: '2024-01-16T13:30:00Z',
    deliveryTime: '2024-01-16T13:42:00Z',
    rating: 5
  },
  {
    id: 'DEL-003',
    restaurant: 'Burger Palace',
    customer: 'Mike Davis',
    address: '789 Pine St',
    distance: '3.1 mi',
    estimatedTime: '18 min',
    earnings: 9.75,
    status: 'completed',
    orderTime: '2024-01-16T12:00:00Z',
    pickupTime: '2024-01-16T12:15:00Z',
    deliveryTime: '2024-01-16T12:33:00Z',
    rating: 4
  }
]

const requirements = [
  { text: 'Valid driver\'s license', completed: true },
  { text: 'Vehicle registration and insurance', completed: true },
  { text: 'Background check completed', completed: true },
  { text: 'Vehicle inspection passed', completed: false },
  { text: 'Food safety certification', completed: false }
]

export default function CourierPage() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_progress: { label: 'In Progress', color: 'bg-blue-500' },
      completed: { label: 'Completed', color: 'bg-green-500' },
      cancelled: { label: 'Cancelled', color: 'bg-red-500' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Become a Courier</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our courier network and start earning money by delivering food to customers in your area.
              Set your own schedule and work when you want.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Flexible Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Earn $15-25 per hour on average. Keep 100% of your tips and get paid weekly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Work When You Want</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Set your own schedule. Work during peak hours or whenever it's convenient for you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Truck className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Easy to Start</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Simple application process. Get approved and start delivering in just a few days.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Requirements Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Requirements</h2>
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      requirement.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {requirement.completed && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className={requirement.completed ? 'text-foreground' : 'text-muted-foreground'}>
                      {requirement.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below to start your courier application.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <Input type="tel" placeholder="Enter your phone number" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Vehicle Type</label>
                <select className="w-full p-2 border border-input rounded-md bg-background">
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="scooter">Scooter</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Years of Driving Experience</label>
                <Input type="number" placeholder="Enter years of experience" />
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setIsRegistered(true)}
              >
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Courier Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your deliveries and track your earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{mockStats.totalDeliveries}</p>
                  <p className="text-muted-foreground">Total Deliveries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">${mockStats.totalEarnings.toFixed(2)}</p>
                  <p className="text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{mockStats.averageRating}</p>
                  <p className="text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{mockStats.activeHours}h</p>
                  <p className="text-muted-foreground">Active Hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deliveries">My Deliveries</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Delivery */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockDeliveries.find(d => d.status === 'in_progress') ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Order #{mockDeliveries.find(d => d.status === 'in_progress')?.id}</h3>
                          <p className="text-muted-foreground">{mockDeliveries.find(d => d.status === 'in_progress')?.restaurant}</p>
                        </div>
                        {getStatusBadge('in_progress')}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{mockDeliveries.find(d => d.status === 'in_progress')?.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">ETA: {mockDeliveries.find(d => d.status === 'in_progress')?.estimatedTime}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full">Navigate to Restaurant</Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active deliveries</p>
                      <Button className="mt-4">Go Online</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Set Availability
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Update Location
                  </Button>
                  <Button className="w-full" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deliveries" className="mt-6">
            <div className="space-y-4">
              {mockDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{delivery.id}</h3>
                        <p className="text-muted-foreground">{delivery.restaurant}</p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {delivery.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(delivery.status)}
                        <p className="text-lg font-bold text-green-600">
                          +${delivery.earnings.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{delivery.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{delivery.distance} • {delivery.estimatedTime}</span>
                      </div>
                    </div>
                    
                    {delivery.rating && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{delivery.rating}/5</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">$247.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Week</span>
                    <span className="font-semibold">$312.75</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">$1,247.50</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${mockStats.totalEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">john.doe@email.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Next payment: Friday</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Update Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
