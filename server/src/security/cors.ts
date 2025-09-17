import cors from 'cors';
import { Request } from 'express';

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // In development, allow all origins for easier testing and sandbox access
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // In production, use strict origin checking
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000', // Next.js dev server
      'https://delivering.vercel.app', // Production frontend
      // process.env.CORS_ORIGIN, // Custom origin from env
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-Apollo-Operation-Name',
    'Apollo-Require-Preflight',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

// Create CORS middleware
export const corsMiddleware = cors(corsOptions);

// CORS preflight handler
export const corsPreflightHandler = (req: Request, res: any, next: any) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-Apollo-Operation-Name, Apollo-Require-Preflight');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(200);
  } else {
    next();
  }
};

export default corsMiddleware;
