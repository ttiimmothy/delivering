import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from "dotenv"

dotenv.config()

// Create the connection
const connectionString = process.env.DATABASE_URL;

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
