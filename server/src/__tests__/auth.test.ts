import { describe, it, expect, beforeEach } from 'vitest';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { makeSchema } from 'nexus';
import { createTestUser, resetTestData } from './utils/fixtures';
import { mockJWT, mockBcrypt } from './utils/mocks';
import { schema } from '../schema';

// Mock external dependencies
mockJWT();
mockBcrypt();

describe('Authentication', () => {
  let server: ApolloServer;
  let mutate: any;

  beforeEach(async () => {
    await resetTestData();
    
    server = new ApolloServer({
      schema,
      context: () => ({ user: null })
    });
    
    const { mutate: testMutate } = createTestClient(server);
    mutate = testMutate;
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const mutation = `
        mutation RegisterUser($input: RegisterInput!) {
          register(input: $input) {
            success
            message
            user {
              id
              email
              firstName
              lastName
            }
          }
        }
      `;

      const variables = {
        input: {
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          phone: '+1234567890'
        }
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.register.success).toBe(true);
      expect(result.data.register.user.email).toBe('newuser@example.com');
      expect(result.data.register.user.firstName).toBe('New');
    });

    it('should fail to register with existing email', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const mutation = `
        mutation RegisterUser($input: RegisterInput!) {
          register(input: $input) {
            success
            message
            user {
              id
              email
            }
          }
        }
      `;

      const variables = {
        input: {
          email: 'existing@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          phone: '+1234567890'
        }
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.register.success).toBe(false);
      expect(result.data.register.message).toContain('already exists');
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      await createTestUser({
        email: 'test@example.com',
        password: 'hashed-password'
      });

      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            success
            message
            token
            user {
              id
              email
              firstName
              lastName
            }
          }
        }
      `;

      const variables = {
        input: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.login.success).toBe(true);
      expect(result.data.login.token).toBe('mock-jwt-token');
      expect(result.data.login.user.email).toBe('test@example.com');
    });

    it('should fail to login with invalid credentials', async () => {
      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            success
            message
            token
            user {
              id
              email
            }
          }
        }
      `;

      const variables = {
        input: {
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        }
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.login.success).toBe(false);
      expect(result.data.login.message).toContain('Invalid credentials');
    });
  });
});
