import Redis from 'ioredis';

// Redis client configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  // retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Cache configuration
const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

// Cache key generators
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  restaurant: (id: string) => `restaurant:${id}`,
  restaurants: (filters: string) => `restaurants:${filters}`,
  menu: (id: string) => `menu:${id}`,
  cart: (userId: string) => `cart:${userId}`,
  order: (id: string) => `order:${id}`,
  orders: (userId: string, filters: string) => `orders:${userId}:${filters}`,
  reviews: (restaurantId: string) => `reviews:${restaurantId}`,
  stats: (type: string) => `stats:${type}`,
};

// Cache operations
export class CacheService {
  // Get value from cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error(`Cache get error: ${error}`);
      return null;
    }
  }

  // Set value in cache
  static async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache set error: ${error}`);
    }
  }

  // Delete value from cache
  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Cache delete error: ${error}`);
    }
  }

  // Delete multiple keys
  static async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`Cache delete pattern error: ${error}`);
    }
  }

  // Check if key exists
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error: ${error}`);
      return false;
    }
  }

  // Get TTL of a key
  static async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error: ${error}`);
      return -1;
    }
  }

  // Increment a counter
  static async incr(key: string, ttl?: number): Promise<number> {
    try {
      const result = await redis.incr(key);
      if (ttl) {
        await redis.expire(key, ttl);
      }
      return result;
    } catch (error) {
      console.error(`Cache incr error: ${error}`);
      return 0;
    }
  }

  // Set with expiration
  static async setex(key: string, value: any, ttl: number): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache setex error: ${error}`);
    }
  }

  // Get or set pattern
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      const data = await fetchFn();
      await this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`Cache getOrSet error: ${error}`);
      return await fetchFn();
    }
  }

  // Clear all cache
  static async clear(): Promise<void> {
    try {
      await redis.flushall();
    } catch (error) {
      console.error(`Cache clear error: ${error}`);
    }
  }

  // Get cache statistics
  static async stats(): Promise<any> {
    try {
      const info = await redis.info('memory');
      const keyspace = await redis.info('keyspace');
      return {
        memory: info,
        keyspace,
        connected: redis.status === 'ready',
      };
    } catch (error) {
      console.error(`Cache stats error: ${error}`);
      return null;
    }
  }
}

// Cache middleware for Express routes
export const cacheMiddleware = (ttl: number = CACHE_TTL.MEDIUM) => {
  return async (req: any, res: any, next: any) => {
    const key = `${req.method}:${req.originalUrl}`;
    
    try {
      const cached = await CacheService.get(key);
      if (cached) {
        return res.json(cached);
      }
      
      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache response
      res.json = function(data: any) {
        CacheService.set(key, data, ttl);
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error(`Cache middleware error: ${error}`);
      next();
    }
  };
};

// Cache invalidation helpers
export const invalidateUserCache = async (userId: string) => {
  await CacheService.del(cacheKeys.user(userId));
  await CacheService.delPattern(`orders:${userId}:*`);
  await CacheService.del(cacheKeys.cart(userId));
};

export const invalidateRestaurantCache = async (restaurantId: string) => {
  await CacheService.del(cacheKeys.restaurant(restaurantId));
  await CacheService.delPattern('restaurants:*');
  await CacheService.del(cacheKeys.reviews(restaurantId));
};

export const invalidateOrderCache = async (orderId: string, userId?: string) => {
  await CacheService.del(cacheKeys.order(orderId));
  if (userId) {
    await CacheService.delPattern(`orders:${userId}:*`);
  }
};

export default CacheService;
