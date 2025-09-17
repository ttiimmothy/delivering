import helmet from 'helmet';

// Helmet configuration for security headers
export const helmetConfig = helmet({
  // Disable CSP entirely - let Apollo Server handle it
  contentSecurityPolicy: false,
  
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false,
  
  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: "same-origin" },
  
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: "cross-origin" },
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // Frameguard
  frameguard: { action: 'deny' },
  
  // Hide X-Powered-By
  hidePoweredBy: true,
  
  // HSTS
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // No Sniff
  noSniff: true,
  
  // Origin Agent Cluster
  originAgentCluster: true,
  
  // Referrer Policy
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  
  // XSS Filter
  xssFilter: true,
});

export default helmetConfig;
