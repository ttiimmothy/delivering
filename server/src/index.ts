import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import { createContext } from './context';
import { schema } from './schema/nexusIndex';
import { corsMiddleware } from './cors';
import { helmetConfig } from './helmet';
import {db} from "./database/drizzle/client";
import stripeRoutes from './routes/stripe';
import { initializeSocketService } from './services/socket';
import cookieParser from "cookie-parser"

import dotenv from "dotenv"

dotenv.config();

const app = express();
const server = createServer(app);

// Create WebSocket server
const wsServer = new WebSocketServer({
  server,
  path: '/api/graphql',
});

// Create PubSub for subscriptions
export const pubsub = new PubSub();

// Initialize Socket.IO service
const socketService = initializeSocketService(server);
export const io = socketService.server; // Export the Socket.IO server instance

// Use the Nexus schema directly (it already includes resolvers)
const executableSchema = schema;

// Create GraphQL server
export const apolloServer = new ApolloServer({
  schema: executableSchema,
  plugins: [
    // Proper shutdown for the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer: server }),
    
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
    // console.error('GraphQL Error:', error);
    return error;
  }
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

// Security middleware
app.use(helmetConfig);
app.use(corsMiddleware);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Webhook endpoints
app.use('/api/webhooks/stripe', stripeRoutes);

// Setup GraphQL endpoint
export const setupGraphQLEndpoint = async () => {
  // Start the Apollo server
  await apolloServer.start();

  const graphqlMiddleware = expressMiddleware(apolloServer, {
    context: createContext,
  });
  
  // Add the GraphQL middleware
  app.use('/api/graphql', graphqlMiddleware);
}

// Setup GraphQL endpoint after server starts
setupGraphQLEndpoint();

// Start HTTP server
server.listen(4000, () => {
  console.log("🚀 Server ready at http://localhost:4000");
  console.log("📊 GraphQL endpoint: http://localhost:4000/api/graphql");
  console.log("🔌 WebSocket endpoint: ws://localhost:4000/api/graphql");
  console.log("🦾 Health check: http://localhost:4000/health");
});