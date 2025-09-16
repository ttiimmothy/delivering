import { describe, it, expect, beforeEach } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { createTestUser, resetTestData } from './lib/fixtures';
import { mockJWT, mockBcrypt } from './lib/setup';
import { createTestServer, executeOperation } from './setup';

// Mock external dependencies
mockJWT();
mockBcrypt();

describe('Authentication', () => {
  let server: ApolloServer;

  beforeEach(async () => {
    await resetTestData();
    server = createTestServer();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const mutation = `
        mutation RegisterUser($input: SignupInput!) {
          signup(input: $input) {
            accessToken
            refreshToken
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

      const result = await executeOperation(server, {
        query: mutation,
        variables
      }, { user: null });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.signup).toBeDefined();
      expect((data?.signup as any).user.email).toBe('newuser@example.com');
      expect((data?.signup as any).user.firstName).toBe('New');
      expect((data?.signup as any).accessToken).toBeDefined();
    });

    it('should fail to register with existing email', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const mutation = `
        mutation RegisterUser($input: SignupInput!) {
          signup(input: $input) {
            accessToken
            refreshToken
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

      const result = await executeOperation(server, {
        query: mutation,
        variables
      }, { user: null });
      
      const errors = result.body.kind === 'single' ? result.body.singleResult.errors : result.body.initialResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].message).toContain('already exists');
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
            accessToken
            refreshToken
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

      const result = await executeOperation(server, {
        query: mutation,
        variables
      }, { user: null });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.login).toBeDefined();
      expect((data?.login as any).accessToken).toBeDefined();
      expect((data?.login as any).user.email).toBe('test@example.com');
    });

    it('should fail to login with invalid credentials', async () => {
      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
            refreshToken
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

      const result = await executeOperation(server, {
        query: mutation,
        variables
      }, { user: null });
      
      const errors = result.body.kind === 'single' ? result.body.singleResult.errors : result.body.initialResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].message).toContain('Invalid credentials');
    });
  });
});
