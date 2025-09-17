'use client'

import { useState } from 'react'
import { Clock, MapPin, Star, Package, CheckCircle, XCircle, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    restaurant: 'Bella Vista Italian',
    status: 'delivered',
    orderDate: '2024-01-15T18:30:00Z',
    deliveryDate: '2024-01-15T19:15:00Z',
    total: 45.99,
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 18.99 },
      { name: 'Caesar Salad', quantity: 1, price: 12.99 },
      { name: 'Tiramisu', quantity: 1, price: 8.99 },
      { name: 'Delivery Fee', quantity: 1, price: 3.99 },
      { name: 'Service Fee', quantity: 1, price: 1.03 }
    ],
    rating: 5,
    courier: 'John D.',
    tracking: {
      current: 'delivered',
      steps: [
        { status: 'confirmed', time: '18:30', completed: true },
        { status: 'preparing', time: '18:45', completed: true },
        { status: 'ready', time: '19:00', completed: true },
        { status: 'picked_up', time: '19:05', completed: true },
        { status: 'delivered', time: '19:15', completed: true }
      ]
    }
  },
  {
    id: 'ORD-002',
    restaurant: 'Sushi Zen',
    status: 'in_transit',
    orderDate: '2024-01-16T12:15:00Z',
    deliveryDate: null,
    total: 67.50,
    items: [
      { name: 'Dragon Roll', quantity: 2, price: 24.99 },
      { name: 'Salmon Sashimi', quantity: 1, price: 18.99 },
      { name: 'Miso Soup', quantity: 1, price: 4.99 },
      { name: 'Delivery Fee', quantity: 1, price: 3.99 },
      { name: 'Service Fee', quantity: 1, price: 1.54 }
    ],
    rating: null,
    courier: 'Sarah M.',
    tracking: {
      current: 'picked_up',
      steps: [
        { status: 'confirmed', time: '12:15', completed: true },
        { status: 'preparing', time: '12:30', completed: true },
        { status: 'ready', time: '12:45', completed: true },
        { status: 'picked_up', time: '12:50', completed: true },
        { status: 'delivered', time: '13:00', completed: false }
      ]
    }
  },
  {
    id: 'ORD-003',
    restaurant: 'Burger Palace',
    status: 'preparing',
    orderDate: '2024-01-16T14:20:00Z',
    deliveryDate: null,
    total: 23.47,
    items: [
      { name: 'Classic Burger', quantity: 1, price: 12.99 },
      { name: 'French Fries', quantity: 1, price: 4.99 },
      { name: 'Coca Cola', quantity: 1, price: 2.99 },
      { name: 'Delivery Fee', quantity: 1, price: 2.50 }
    ],
    rating: null,
    courier: null,
    tracking: {
      current: 'preparing',
      steps: [
        { status: 'confirmed', time: '14:20', completed: true },
        { status: 'preparing', time: '14:25', completed: true },
        { status: 'ready', time: '14:40', completed: false },
        { status: 'picked_up', time: '14:45', completed: false },
        { status: 'delivered', time: '15:00', completed: false }
      ]
    }
  },
  {
    id: 'ORD-004',
    restaurant: 'Taco Fiesta',
    status: 'cancelled',
    orderDate: '2024-01-14T20:10:00Z',
    deliveryDate: null,
    total: 19.99,
    items: [
      { name: 'Chicken Tacos', quantity: 3, price: 15.99 },
      { name: 'Guacamole', quantity: 1, price: 3.99 }
    ],
    rating: null,
    courier: null,
    tracking: {
      current: 'cancelled',
      steps: [
        { status: 'confirmed', time: '20:10', completed: true },
        { status: 'preparing', time: '20:15', completed: false },
        { status: 'ready', time: '20:30', completed: false },
        { status: 'picked_up', time: '20:35', completed: false },
        { status: 'delivered', time: '20:50', completed: false }
      ]
    }
  }
]

const statusConfig = {
  confirmed: { label: 'Order Confirmed', color: 'bg-blue-500', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-yellow-500', icon: Clock },
  ready: { label: 'Ready for Pickup', color: 'bg-orange-500', icon: Package },
  picked_up: { label: 'Picked Up', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle }
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')

  const getOrdersByStatus = (status: string) => {
    if (status === 'all') return mockOrders
    return mockOrders.filter(order => order.status === status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    
    const Icon = config.icon
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const renderTrackingSteps = (tracking: any) => {
    return (
      <div className="space-y-2">
        {tracking.steps.map((step: any, index: number) => {
          const config = statusConfig[step.status as keyof typeof statusConfig]
          const Icon = config?.icon || Clock
          const isCompleted = step.completed
          const isCurrent = tracking.current === step.status
          
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                <Icon className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {config?.label || step.status}
                </p>
                <p className="text-xs text-muted-foreground">{step.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground text-lg">
            Track your orders and view order history
          </p>
        </div>

        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="in_transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-6">
              {getOrdersByStatus(activeTab).map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{order.restaurant}</CardTitle>
                        <p className="text-muted-foreground">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Ordered on {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-2xl font-bold mt-2">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-sm font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tracking Information */}
                    {order.status !== 'cancelled' && (
                      <div>
                        <h4 className="font-semibold mb-3">Order Tracking</h4>
                        {renderTrackingSteps(order.tracking)}
                        
                        {order.courier && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                              <strong>Courier:</strong> {order.courier}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === 'delivered' && !order.rating && (
                        <Button size="sm">
                          Rate Order
                        </Button>
                      )}
                      {order.status === 'delivered' && order.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">Rated {order.rating}/5</span>
                        </div>
                      )}
                      {order.status === 'preparing' && (
                        <Button variant="destructive" size="sm">
                          Cancel Order
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getOrdersByStatus(activeTab).length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No orders found in this category.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
