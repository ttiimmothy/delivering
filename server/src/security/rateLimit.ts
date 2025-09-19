import rateLimit from 'express-rate-limit';
// import slowDown from 'express-slow-down';
import { Request, Response } from 'express';

// General rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Rate limit warning: IP ${req.ip || 'unknown'} exceeded limit on ${req.path}`);
    res.status(429).json({
      error: {
        message: 'Too many requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
      },
    });
  },
});

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: {
      message: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Auth rate limit warning: IP ${req.ip || 'unknown'} exceeded limit on ${req.path}`);
    res.status(429).json({
      error: {
        message: 'Too many authentication attempts, please try again later.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
      },
    });
  },
});

// API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    error: {
      message: 'Too many API requests, please try again later.',
      code: 'API_RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`API rate limit warning: IP ${req.ip || 'unknown'} exceeded limit on ${req.path}`);
    res.status(429).json({
      error: {
        message: 'Too many API requests, please try again later.',
        code: 'API_RATE_LIMIT_EXCEEDED',
      },
    });
  },
});

// GraphQL rate limiting
export const graphqlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 GraphQL requests per windowMs
  message: {
    error: {
      message: 'Too many GraphQL requests, please try again later.',
      code: 'GRAPHQL_RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`GraphQL rate limit warning: IP ${req.ip || 'unknown'} exceeded limit on /graphql`);
    res.status(429).json({
      error: {
        message: 'Too many GraphQL requests, please try again later.',
        code: 'GRAPHQL_RATE_LIMIT_EXCEEDED',
      },
    });
  },
});

// Webhook rate limiting (more lenient)
export const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 webhook requests per minute
  message: {
    error: {
      message: 'Too many webhook requests, please try again later.',
      code: 'WEBHOOK_RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Webhook rate limit warning: IP ${req.ip || 'unknown'} exceeded limit on ${req.path}`);
    res.status(429).json({
      error: {
        message: 'Too many webhook requests, please try again later.',
        code: 'WEBHOOK_RATE_LIMIT_EXCEEDED',
      },
    });
  },
});

// Create custom rate limiter
export function createCustomLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  code?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      error: {
        message: options.message || 'Too many requests, please try again later.',
        code: options.code || 'RATE_LIMIT_EXCEEDED',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      console.warn(`Custom rate limit warning: IP ${req.ip || 'unknown'} exceeded limit on ${req.path}`);
      res.status(429).json({
        error: {
          message: options.message || 'Too many requests, please try again later.',
          code: options.code || 'RATE_LIMIT_EXCEEDED',
        },
      });
    },
  });
}

// Rate limit by user ID (for authenticated users)
export function createUserRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  code?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    keyGenerator: (req: Request) => {
      // Use user ID if authenticated, otherwise fall back to IP
      return req.user?.userId || req.ip || 'unknown';
    },
    message: {
      error: {
        message: options.message || 'Too many requests, please try again later.',
        code: options.code || 'USER_RATE_LIMIT_EXCEEDED',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      const key = req.user?.userId || req.ip || 'unknown';
      console.warn(`Custom rate limit warning: Key ${key} exceeded limit on ${req.path}`);
      res.status(429).json({
        error: {
          message: options.message || 'Too many requests, please try again later.',
          code: options.code || 'USER_RATE_LIMIT_EXCEEDED',
        },
      });
    },
  });
}

export default {
  generalLimiter,
  authLimiter,
  apiLimiter,
  graphqlLimiter,
  webhookLimiter,
  createCustomLimiter,
  createUserRateLimiter,
};
