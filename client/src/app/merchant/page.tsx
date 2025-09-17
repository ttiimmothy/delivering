'use client'

import { useState } from 'react'
import { Store, TrendingUp, Users, Clock, DollarSign, CheckCircle, Star, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

// Mock data for merchant dashboard
const mockStats = {
  totalOrders: 1247,
  totalRevenue: 45678.90,
  averageRating: 4.6,
  activeHours: 168
}

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    items: ['Margherita Pizza', 'Caesar Salad'],
    total: 45.99,
    status: 'preparing',
    orderTime: '2024-01-16T14:30:00Z',
    estimatedReady: '2024-01-16T15:00:00Z',
    deliveryAddress: '123 Main St, Apt 4B'
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    items: ['Dragon Roll', 'Miso Soup'],
    total: 67.50,
    status: 'ready',
    orderTime: '2024-01-16T13:15:00Z',
    estimatedReady: '2024-01-16T13:45:00Z',
    deliveryAddress: '456 Oak Ave, Unit 2'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    items: ['Classic Burger', 'French Fries'],
    total: 23.47,
    status: 'delivered',
    orderTime: '2024-01-16T12:00:00Z',
    estimatedReady: '2024-01-16T12:30:00Z',
    deliveryAddress: '789 Pine St',
    deliveryTime: '2024-01-16T12:45:00Z',
    rating: 5
  }
]

const mockMenuItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 18.99,
    description: 'Fresh mozzarella, tomato sauce, basil',
    available: true,
    image: '/api/placeholder/100/100'
  },
  {
    id: 2,
    name: 'Caesar Salad',
    category: 'Salads',
    price: 12.99,
    description: 'Romaine lettuce, parmesan, croutons',
    available: true,
    image: '/api/placeholder/100/100'
  },
  {
    id: 3,
    name: 'Dragon Roll',
    category: 'Sushi',
    price: 24.99,
    description: 'Eel, cucumber, avocado, eel sauce',
    available: false,
    image: '/api/placeholder/100/100'
  }
]

const requirements = [
  { text: 'Valid business license', completed: true },
  { text: 'Food safety certification', completed: true },
  { text: 'Commercial kitchen inspection', completed: true },
  { text: 'Insurance documentation', completed: false },
  { text: 'Bank account verification', completed: false }
]

export default function MerchantPage() {
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
      preparing: { label: 'Preparing', color: 'bg-yellow-500' },
      ready: { label: 'Ready for Pickup', color: 'bg-orange-500' },
      delivered: { label: 'Delivered', color: 'bg-green-500' },
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
        <div className="container py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Partner with Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our restaurant partner network and reach more customers. 
              Increase your sales with our delivery platform.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Increase Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Reach new customers and increase your revenue by up to 30% with our delivery platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Reach More Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Access thousands of customers in your area who are looking for great food delivery.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Store className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Easy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Manage your menu, orders, and analytics all in one place with our merchant dashboard.
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
              <CardTitle>Restaurant Application</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below to start your restaurant partnership application.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Restaurant Name</label>
                  <Input placeholder="Enter restaurant name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cuisine Type</label>
                  <Input placeholder="e.g., Italian, Mexican, Asian" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Contact Person</label>
                <Input placeholder="Enter contact person name" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="Enter email" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input type="tel" placeholder="Enter phone number" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Restaurant Address</label>
                <Input placeholder="Enter full address" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Years in Business</label>
                  <Input type="number" placeholder="Enter years" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Average Order Value</label>
                  <Input type="number" placeholder="Enter average order value" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Business License Number</label>
                <Input placeholder="Enter business license number" />
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
          <h1 className="text-4xl font-bold mb-2">Restaurant Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your restaurant and track your performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
                  <p className="text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">${mockStats.totalRevenue.toFixed(2)}</p>
                  <p className="text-muted-foreground">Total Revenue</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">#{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Store className="h-4 w-4 mr-2" />
                    Update Restaurant Info
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Set Operating Hours
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Update Delivery Areas
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-muted-foreground">Customer: {order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          Ordered: {formatDate(order.orderTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium">Items:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    
                    {order.rating && (
                      <div className="flex items-center space-x-1 mb-4">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">Customer Rating: {order.rating}/5</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {order.status === 'preparing' && (
                        <Button size="sm">Mark as Ready</Button>
                      )}
                      {order.status === 'ready' && (
                        <Button size="sm" variant="outline">Order Picked Up</Button>
                      )}
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Menu Management</h2>
              <Button>Add New Item</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMenuItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">
                          {item.available ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Today</span>
                    <span className="font-semibold">$247.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">$1,847.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">$7,247.50</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Revenue</span>
                      <span>${mockStats.totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Order Value</span>
                    <span className="font-semibold">$36.70</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orders per Day</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Rating</span>
                    <span className="font-semibold flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {mockStats.averageRating}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold">98.5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
