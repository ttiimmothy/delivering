import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import { createContext } from './context';
import { schema } from './schema/consolidated-index';
import { corsMiddleware } from './security/cors';
import { helmetConfig } from './security/helmet';
import { generalLimiter, apiLimiter, graphqlLimiter } from './security/rateLimit';
import {db} from "./db/client";
import stripeRoutes from './routes/stripe';
import { initializeSocketService } from './services/socket';

// Create Express app
export const app = express();
export const httpServer = createServer(app);

// Create WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Create PubSub for subscriptions
export const pubsub = new PubSub();

// Initialize Socket.IO service
const socketService = initializeSocketService(httpServer);

// Use the Nexus schema directly (it already includes resolvers)
const executableSchema = schema;

// Create GraphQL server
export const server = new ApolloServer({
  schema: executableSchema,
  plugins: [
    // Proper shutdown for the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer }),
    
    // Proper shutdown for the WebSocket server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

// WebSocket server cleanup
const serverCleanup = useServer(
  {
    schema: executableSchema,
    context: async (ctx) => {
      // Extract user from connection params
      const token = (ctx.connectionParams?.authorization as string)?.replace('Bearer ', '');
      if (token) {
        try {
          const { verifyAccessToken } = await import('./lib/auth');
          const user = verifyAccessToken(token);
          return { user, db };
        } catch (error) {
          return { user: null, db };
        }
      }
      return { user: null, db };
    },
  },
  wsServer
);

// Middleware setup
export function setupMiddleware() {
  // Security middleware
  app.use(helmetConfig);
  app.use(corsMiddleware);
  
  // Rate limiting
  app.use(generalLimiter);
  app.use('/api', apiLimiter);
  app.use('/graphql', graphqlLimiter);
  
  // Logging - using console for basic request logging
  app.use((req, res, next) => {
    const start = Date.now();
    console.log(`Incoming request: ${req.method} ${req.url}`);
    
    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any, cb?: any) {
      const duration = Date.now() - start;
      console.log(`Request completed: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
      return originalEnd.call(this, chunk, encoding, cb);
    };
    
    next();
  });
  
  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
  
  // Webhook endpoints
  app.use('/webhooks/stripe', stripeRoutes);
  
  // GraphQL endpoint (will be set up after server starts)
  // This is a placeholder that will be replaced by setupGraphQLEndpoint()
  
  // Error handling - using standard Express error handling
  app.use((error: Error, req: any, res: any, next: any) => {
    console.error('Error occurred:', error);
    
    // Handle known error types
    if (error.name === 'AuthenticationError') {
      return res.status(401).json({
        error: {
          message: error.message,
          code: 'AUTHENTICATION_ERROR',
          statusCode: 401,
        },
      });
    }
    
    if (error.name === 'AuthorizationError') {
      return res.status(403).json({
        error: {
          message: error.message,
          code: 'AUTHORIZATION_ERROR',
          statusCode: 403,
        },
      });
    }
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        error: {
          message: error.message,
          code: 'NOT_FOUND_ERROR',
          statusCode: 404,
        },
      });
    }
    
    if (error.name === 'ConflictError') {
      return res.status(409).json({
        error: {
          message: error.message,
          code: 'CONFLICT_ERROR',
          statusCode: 409,
        },
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          message: error.message,
          code: 'VALIDATION_ERROR',
          statusCode: 400,
        },
      });
    }
    
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          message: 'Invalid token',
          code: 'TOKEN_INVALID',
          statusCode: 401,
        },
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
          statusCode: 401,
        },
      });
    }
    
    // Default error response
    const statusCode = process.env.NODE_ENV === 'production' ? 500 : 500;
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message;

    res.status(statusCode).json({
      error: {
        message,
        code: 'INTERNAL_ERROR',
        statusCode,
      },
    });
  });
  
  // GraphQL endpoint placeholder (will be replaced by setupGraphQLEndpoint)
  // This ensures it's added before the 404 handler
  
  // 404 handler - temporarily disabled for testing
  // app.use('*', (req, res) => {
  //   res.status(404).json({
  //     error: {
  //       message: 'Route not found',
  //       code: 'NOT_FOUND',
  //     },
  //   });
  // });
}

// Setup GraphQL endpoint
export function setupGraphQLEndpoint() {
  // Insert the GraphQL middleware before the 404 handler
  // We need to find the 404 handler and insert before it
  const middlewareStack = app._router.stack;
  const graphqlMiddleware = expressMiddleware(server, {
    context: createContext,
  });
  
  // Add the GraphQL middleware
  app.use('/graphql', graphqlMiddleware);
}

export default app;
