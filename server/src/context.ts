import { Request, Response } from 'express';
import { JWTPayload, getCurrentUser } from './utils/auth';
import { db } from './db/client';

export interface Context {
  req: Request;
  res: Response;
  user: JWTPayload | null;
  db: typeof db;
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  // Extract user from JWT token
  const user = getCurrentUser(req.headers.authorization);
  
  return {
    req,
    res,
    user,
    db,
  };
}
