import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verify } from 'jsonwebtoken';
import { db } from '../database/drizzle/client';
import { users } from '../database/drizzle/schema';
import { eq } from 'drizzle-orm';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface CourierLocationUpdate {
  courierId: string;
  deliveryId: string;
  location: LocationUpdate;
  estimatedArrival?: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: string;
  message?: string;
  metadata?: any;
}

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private courierLocations: Map<string, LocationUpdate> = new Map(); // courierId -> location

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: ["http://localhost:3000", 'https://delivering-one.vercel.app'],
        methods: ["GET", "POST"],
        credentials: true
      },
      // path: '/socket.io'
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  // Getter to access the Socket.IO server instance
  server(): SocketIOServer {
    return this.io;
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = verify(token, process.env.JWT_SECRET!) as any;
        
        // Get user from database
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.id, decoded.userId))
          .limit(1);

        if (userResult.length === 0) {
          return next(new Error('User not found'));
        }

        const user = userResult[0];
        socket.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.user?.email} (${socket.id})`);

      // Store user connection
      if (socket.user) {
        this.connectedUsers.set(socket.user.id, socket.id);
      }

      // Join user to their personal room
      if (socket.user) {
        socket.join(`user:${socket.user.id}`);
        
        // Join role-specific rooms
        socket.join(`role:${socket.user.role}`);
        
        // Join courier-specific room if user is a courier
        if (socket.user.role === 'courier') {
          socket.join('couriers');
        }
        
        // Join merchant-specific room if user is a merchant
        if (socket.user.role === 'merchant') {
          socket.join('merchants');
        }
      }

      // Handle courier location updates
      socket.on('courier:location:update', (data: CourierLocationUpdate) => {
        this.handleCourierLocationUpdate(socket, data);
      });

      // Handle courier status updates
      socket.on('courier:status:update', (data: { isAvailable: boolean }) => {
        this.handleCourierStatusUpdate(socket, data);
      });

      // Handle order status updates
      socket.on('order:status:update', (data: OrderStatusUpdate) => {
        this.handleOrderStatusUpdate(socket, data);
      });

      // Handle delivery assignment
      socket.on('delivery:assign', (data: { deliveryId: string, courierId: string }) => {
        this.handleDeliveryAssignment(socket, data);
      });

      // Handle delivery acceptance
      socket.on('delivery:accept', (data: { deliveryId: string }) => {
        this.handleDeliveryAcceptance(socket, data);
      });

      // Handle delivery pickup
      socket.on('delivery:pickup', (data: { deliveryId: string }) => {
        this.handleDeliveryPickup(socket, data);
      });

      // Handle delivery completion
      socket.on('delivery:complete', (data: { deliveryId: string }) => {
        this.handleDeliveryCompletion(socket, data);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user?.email} (${socket.id})`);
        
        if (socket.user) {
          this.connectedUsers.delete(socket.user.id);
          
          // Remove courier location if user is a courier
          if (socket.user.role === 'courier') {
            this.courierLocations.delete(socket.user.id);
            this.broadcastCourierLocationUpdate(socket.user.id, null);
          }
        }
      });
    });
  }

  private handleCourierLocationUpdate(socket: AuthenticatedSocket, data: CourierLocationUpdate) {
    if (!socket.user || socket.user.role !== 'courier') {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Update courier location
    this.courierLocations.set(socket.user.id, data.location);

    // Broadcast location update to relevant parties
    this.broadcastCourierLocationUpdate(socket.user.id, data);
  }

  private handleCourierStatusUpdate(socket: AuthenticatedSocket, data: { isAvailable: boolean }) {
    if (!socket.user || socket.user.role !== 'courier') {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Broadcast status update to merchants and admins
    this.io.to('merchants').to('role:admin').emit('courier:status:changed', {
      courierId: socket.user.id,
      isAvailable: data.isAvailable,
      timestamp: new Date().toISOString(),
    });
  }

  private handleOrderStatusUpdate(socket: AuthenticatedSocket, data: OrderStatusUpdate) {
    if (!socket.user) {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Broadcast order status update to relevant parties
    this.io.emit('order:status:changed', {
      orderId: data.orderId,
      status: data.status,
      message: data.message,
      metadata: data.metadata,
      timestamp: new Date().toISOString(),
    });
  }

  private handleDeliveryAssignment(socket: AuthenticatedSocket, data: { deliveryId: string, courierId: string }) {
    if (!socket.user || !['merchant', 'admin'].includes(socket.user.role)) {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Notify assigned courier
    const courierSocketId = this.connectedUsers.get(data.courierId);
    if (courierSocketId) {
      this.io.to(courierSocketId).emit('delivery:assigned', {
        deliveryId: data.deliveryId,
        assignedBy: socket.user.id,
        timestamp: new Date().toISOString(),
      });
    }

    // Notify customer about courier assignment
    this.io.emit('delivery:assigned', {
      deliveryId: data.deliveryId,
      courierId: data.courierId,
      timestamp: new Date().toISOString(),
    });
  }

  private handleDeliveryAcceptance(socket: AuthenticatedSocket, data: { deliveryId: string }) {
    if (!socket.user || socket.user.role !== 'courier') {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Broadcast delivery acceptance
    this.io.emit('delivery:accepted', {
      deliveryId: data.deliveryId,
      courierId: socket.user.id,
      timestamp: new Date().toISOString(),
    });
  }

  private handleDeliveryPickup(socket: AuthenticatedSocket, data: { deliveryId: string }) {
    if (!socket.user || socket.user.role !== 'courier') {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Broadcast delivery pickup
    this.io.emit('delivery:picked_up', {
      deliveryId: data.deliveryId,
      courierId: socket.user.id,
      timestamp: new Date().toISOString(),
    });
  }

  private handleDeliveryCompletion(socket: AuthenticatedSocket, data: { deliveryId: string }) {
    if (!socket.user || socket.user.role !== 'courier') {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Broadcast delivery completion
    this.io.emit('delivery:completed', {
      deliveryId: data.deliveryId,
      courierId: socket.user.id,
      timestamp: new Date().toISOString(),
    });
  }

  private broadcastCourierLocationUpdate(courierId: string, data: CourierLocationUpdate | null) {
    this.io.emit('courier:location:changed', {
      courierId,
      location: data?.location || null,
      estimatedArrival: data?.estimatedArrival || null,
      timestamp: new Date().toISOString(),
    });
  }

  // Public methods for external use
  public emitOrderStatusUpdate(orderId: string, status: string, message?: string, metadata?: any) {
    this.io.emit('order:status:changed', {
      orderId,
      status,
      message,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  public emitDeliveryAssignment(deliveryId: string, courierId: string, assignedBy: string) {
    this.io.emit('delivery:assigned', {
      deliveryId,
      courierId,
      assignedBy,
      timestamp: new Date().toISOString(),
    });
  }

  public emitCourierLocationUpdate(courierId: string, location: LocationUpdate, estimatedArrival?: string) {
    this.courierLocations.set(courierId, location);
    this.broadcastCourierLocationUpdate(courierId, { courierId, deliveryId: '', location, estimatedArrival });
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  public getCourierLocations(): Map<string, LocationUpdate> {
    return new Map(this.courierLocations);
  }

  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  public emitToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  public emitToRole(role: string, event: string, data: any) {
    this.io.to(`role:${role}`).emit(event, data);
  }

  public emitToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }
}

// Export singleton instance
let socketService: SocketService | null = null;

export const initializeSocketService = (httpServer: HTTPServer): SocketService => {
  if (!socketService) {
    socketService = new SocketService(httpServer);
  }
  return socketService;
};

export const getSocketService = (): SocketService | null => {
  return socketService;
};
