import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import schema from './schema';
import dotenv from "dotenv"

dotenv.config()

// Create the connection
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER || 'myuser'}:${process.env.DB_PASSWORD || 'mysecretpassword'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'delivering'}`;

// Create the postgres client
const client = postgres(connectionString, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the drizzle instance
export const db = drizzle(client, { schema });

// Export the client for direct access if needed
export { client };

// Export schema for use in other files
export * from './schema';
