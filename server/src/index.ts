import { setupMiddleware, setupGraphQLEndpoint, httpServer } from './http';
import { server } from './http';
// import logger from './utils/logger';
import dotenv from "dotenv"

dotenv.config();

const PORT = 4000;

async function startServer() {
  try {
    // Setup middleware
    setupMiddleware();
    
    // Start the Apollo server
    await server.start();
    
    // Setup GraphQL endpoint after server starts
    setupGraphQLEndpoint();
    
    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/api/graphql`);
      console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/api/graphql`);
      console.log(`🦾 Health check: http://localhost:${PORT}/health`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Stop accepting new connections
    httpServer.close(() => {
      console.log('HTTP server closed');
    });
    
    // Stop GraphQL server
    await server.stop();
    console.log('GraphQL server stopped');
    
    // Close database connections
    // await db.close();
    console.log('Database connections closed');
    
    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
