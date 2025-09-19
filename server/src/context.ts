import { Request, Response } from 'express';
import { JWTPayload, getCurrentUser } from './lib/auth';
import { db } from './database/drizzle/client';

export interface Context {
  req: Request;
  res: Response;
  user: JWTPayload | null;
  db: typeof db;
  refreshToken: string | null
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  // Debug logging
  // console.log('=== Context Debug ===');
  // console.log('All cookies:', req.cookies);
  // console.log('accessToken cookie:', req.cookies.accessToken);
  // console.log('refreshToken cookie:', req.cookies.refreshToken);
  // console.log('Authorization header:', req.headers.authorization);
  // console.log('User-Agent:', req.headers['user-agent']);
  // console.log('Origin:', req.headers.origin);
  // console.log('Referer:', req.headers.referer);
  // console.log('===================');
  
  // Extract user from JWT token
  const user = getCurrentUser(req.cookies.accessToken, req.headers.authorization);
  const refreshToken = req.cookies.refreshToken
  
  return {
    req,
    res,
    user,
    db,
    refreshToken
  };
}
