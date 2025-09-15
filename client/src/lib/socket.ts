import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      auth: {
        token,
      },
      path: '/socket.io',
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Order events
  onOrderStatusChanged(callback: (data: any) => void) {
    this.socket?.on('order:status:changed', callback);
  }

  offOrderStatusChanged(callback: (data: any) => void) {
    this.socket?.off('order:status:changed', callback);
  }

  // Courier location events
  onCourierLocationChanged(callback: (data: any) => void) {
    this.socket?.on('courier:location:changed', callback);
  }

  offCourierLocationChanged(callback: (data: any) => void) {
    this.socket?.off('courier:location:changed', callback);
  }

  // Delivery events
  onDeliveryAssigned(callback: (data: any) => void) {
    this.socket?.on('delivery:assigned', callback);
  }

  offDeliveryAssigned(callback: (data: any) => void) {
    this.socket?.off('delivery:assigned', callback);
  }

  onDeliveryAccepted(callback: (data: any) => void) {
    this.socket?.on('delivery:accepted', callback);
  }

  offDeliveryAccepted(callback: (data: any) => void) {
    this.socket?.off('delivery:accepted', callback);
  }

  onDeliveryStatusChanged(callback: (data: any) => void) {
    this.socket?.on('delivery:status:changed', callback);
  }

  offDeliveryStatusChanged(callback: (data: any) => void) {
    this.socket?.off('delivery:status:changed', callback);
  }

  onDeliveryPickedUp(callback: (data: any) => void) {
    this.socket?.on('delivery:picked_up', callback);
  }

  offDeliveryPickedUp(callback: (data: any) => void) {
    this.socket?.off('delivery:picked_up', callback);
  }

  onDeliveryCompleted(callback: (data: any) => void) {
    this.socket?.on('delivery:completed', callback);
  }

  offDeliveryCompleted(callback: (data: any) => void) {
    this.socket?.off('delivery:completed', callback);
  }

  // Courier status events
  onCourierStatusChanged(callback: (data: any) => void) {
    this.socket?.on('courier:status:changed', callback);
  }

  offCourierStatusChanged(callback: (data: any) => void) {
    this.socket?.off('courier:status:changed', callback);
  }

  // Emit events
  emitCourierLocationUpdate(data: {
    courierId: string;
    deliveryId: string;
    location: {
      latitude: number;
      longitude: number;
      timestamp: string;
    };
    estimatedArrival?: string;
  }) {
    this.socket?.emit('courier:location:update', data);
  }

  emitCourierStatusUpdate(data: { isAvailable: boolean }) {
    this.socket?.emit('courier:status:update', data);
  }

  emitOrderStatusUpdate(data: {
    orderId: string;
    status: string;
    message?: string;
    metadata?: any;
  }) {
    this.socket?.emit('order:status:update', data);
  }

  emitDeliveryAccept(data: { deliveryId: string }) {
    this.socket?.emit('delivery:accept', data);
  }

  emitDeliveryPickup(data: { deliveryId: string }) {
    this.socket?.emit('delivery:pickup', data);
  }

  emitDeliveryComplete(data: { deliveryId: string }) {
    this.socket?.emit('delivery:complete', data);
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
