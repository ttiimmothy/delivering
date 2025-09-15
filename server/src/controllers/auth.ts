import { db } from '../db/client';
import { users } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { 
  hashPassword, 
  comparePassword, 
  generateTokenPair, 
  verifyRefreshToken,
  signupSchema,
  loginSchema,
  JWTPayload
} from '../lib/auth';
// Removed custom error imports - using standard Error instead
import { OAuth2Client } from 'google-auth-library';

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  // Sign up a new user
  static async signup(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'customer' | 'courier' | 'merchant';
  }) {
    // Validate input
    const validatedInput = signupSchema.parse(input);
    
    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, validatedInput.email))
      .limit(1);
    
    if (existingUser[0]) {
      const error = new Error('User with this email already exists');
      error.name = 'ConflictError';
      throw error;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedInput.password);
    
    // Create user
    const [newUser] = await db.insert(users).values({
      email: validatedInput.email,
      password: hashedPassword,
      firstName: validatedInput.firstName,
      lastName: validatedInput.lastName,
      phone: validatedInput.phone,
      role: validatedInput.role || 'customer',
      emailVerified: false, // Will be verified via email
    }).returning();
    
    // Generate tokens
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);
    
    // Store refresh token
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days
    
    await db.update(users)
      .set({
        refreshToken,
        refreshTokenExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, newUser.id));
    
    return {
      accessToken,
      refreshToken,
      user: newUser,
    };
  }
  
  // Login user
  static async login(input: { email: string; password: string }) {
    // Validate input
    const validatedInput = loginSchema.parse(input);
    
    // Find user
    const user = await db.select()
      .from(users)
      .where(eq(users.email, validatedInput.email))
      .limit(1);
    
    if (!user[0]) {
      const error = new Error('Invalid email or password');
      error.name = 'AuthenticationError';
      throw error;
    }
    
    // Check if user is active
    if (!user[0].isActive) {
      const error = new Error('Account is deactivated');
      error.name = 'AuthenticationError';
      throw error;
    }
    
    // Verify password
    if (!user[0].password) {
      const error = new Error('Invalid email or password');
      error.name = 'AuthenticationError';
      throw error;
    }
    
    const isPasswordValid = await comparePassword(validatedInput.password, user[0].password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.name = 'AuthenticationError';
      throw error;
    }
    
    // Generate tokens
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user[0].id,
      email: user[0].email,
      role: user[0].role,
    };
    
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);
    
    // Store refresh token
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days
    
    await db.update(users)
      .set({
        refreshToken,
        refreshTokenExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user[0].id));
    
    return {
      accessToken,
      refreshToken,
      user: user[0],
    };
  }
  
  // Login with Google
  static async loginWithGoogle(idToken: string) {
    try {
      // Verify Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        const error = new Error('Invalid Google token');
        error.name = 'AuthenticationError';
        throw error;
      }
      
      const { email, given_name, family_name, sub: googleId } = payload;
      
      if (!email) {
        const error = new Error('Email not provided by Google');
        error.name = 'AuthenticationError';
        throw error;
      }
      
      // Check if user exists
      let user = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (!user[0]) {
        // Create new user
        const [newUser] = await db.insert(users).values({
          email,
          firstName: given_name || 'User',
          lastName: family_name || '',
          googleId,
          role: 'customer',
          emailVerified: true, // Google emails are verified
        }).returning();
        
        user = [newUser];
      } else {
        // Update existing user with Google ID if not set
        if (!user[0].googleId) {
          await db.update(users)
            .set({
              googleId,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user[0].id));
        }
      }
      
      // Check if user is active
      if (!user[0].isActive) {
        const error = new Error('Account is deactivated');
        error.name = 'AuthenticationError';
        throw error;
      }
      
      // Generate tokens
      const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user[0].id,
        email: user[0].email,
        role: user[0].role,
      };
      
      const { accessToken, refreshToken } = generateTokenPair(tokenPayload);
      
      // Store refresh token
      const refreshTokenExpiresAt = new Date();
      refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days
      
      await db.update(users)
        .set({
          refreshToken,
          refreshTokenExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user[0].id));
      
      return {
        accessToken,
        refreshToken,
        user: user[0],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AuthenticationError') {
        throw error;
      }
      const authError = new Error('Google authentication failed');
      authError.name = 'AuthenticationError';
      throw authError;
    }
  }
  
  // Refresh access token
  static async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);
      
      // Find user and verify refresh token
      const user = await db.select()
        .from(users)
        .where(and(
          eq(users.id, payload.userId),
          eq(users.refreshToken, refreshToken)
        ))
        .limit(1);
      
      if (!user[0]) {
        const error = new Error('Invalid refresh token');
        error.name = 'AuthenticationError';
        throw error;
      }
      
      // Check if refresh token is expired
      if (user[0].refreshTokenExpiresAt && user[0].refreshTokenExpiresAt < new Date()) {
        const error = new Error('Refresh token expired');
        error.name = 'AuthenticationError';
        throw error;
      }
      
      // Check if user is active
      if (!user[0].isActive) {
        const error = new Error('Account is deactivated');
        error.name = 'AuthenticationError';
        throw error;
      }
      
      // Generate new tokens
      const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user[0].id,
        email: user[0].email,
        role: user[0].role,
      };
      
      const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload);
      
      // Store new refresh token
      const refreshTokenExpiresAt = new Date();
      refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days
      
      await db.update(users)
        .set({
          refreshToken: newRefreshToken,
          refreshTokenExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user[0].id));
      
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AuthenticationError') {
        throw error;
      }
      const authError = new Error('Token refresh failed');
      authError.name = 'AuthenticationError';
      throw authError;
    }
  }
  
  // Logout user
  static async logout(userId: string) {
    // Clear refresh token
    await db.update(users)
      .set({
        refreshToken: null,
        refreshTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    
    return true;
  }
  
  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Find user
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!user[0]) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Verify current password
    if (!user[0].password) {
      const error = new Error('No password set for this account');
      error.name = 'AuthenticationError';
      throw error;
    }
    
    const isCurrentPasswordValid = await comparePassword(currentPassword, user[0].password);
    if (!isCurrentPasswordValid) {
      const error = new Error('Current password is incorrect');
      error.name = 'AuthenticationError';
      throw error;
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    
    // Update password
    await db.update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    
    return true;
  }
  
  // Reset password (for forgot password flow)
  static async resetPassword(email: string, resetToken: string, newPassword: string) {
    // This would typically involve:
    // 1. Verifying the reset token
    // 2. Checking if it's not expired
    // 3. Updating the password
    // For now, we'll implement a basic version
    
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!user[0]) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    
    // Update password
    await db.update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user[0].id));
    
    return true;
  }
}
