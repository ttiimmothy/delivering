import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { 
  loginMutation, 
  signupMutation, 
  loginWithGoogleMutation,
  refreshTokenMutation,
  logoutMutation,
  meQuery 
} from '@/lib/graphql/operations';
import { 
  LoginInput, 
  SignupInput, 
  AuthResponse, 
  RefreshTokenResponse,
  User 
} from '@/types/graphql';

export const useAuth = () => {
  // Queries
  const { data: meData, loading: meLoading, error: meError, refetch: refetchMe } = useQuery(meQuery, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [loginMutationFn, { loading: loginLoading, error: loginError }] = useMutation(loginMutation);
  const [signupMutationFn, { loading: signupLoading, error: signupError }] = useMutation(signupMutation);
  const [loginWithGoogleMutationFn, { loading: googleLoginLoading, error: googleLoginError }] = useMutation(loginWithGoogleMutation);
  const [refreshTokenMutationFn, { loading: refreshLoading, error: refreshError }] = useMutation(refreshTokenMutation);
  const [logoutMutationFn, { loading: logoutLoading, error: logoutError }] = useMutation(logoutMutation);

  // Computed values
  const user: User | null = meData?.me || null;
  const isAuthenticated = !!user;
  const isLoading = meLoading || loginLoading || signupLoading || googleLoginLoading || refreshLoading || logoutLoading;

  // Auth functions
  const login = useCallback(async (input: LoginInput): Promise<AuthResponse | null> => {
    try {
      const { data } = await loginMutationFn({ variables: { input } });
      if (data?.login) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.login.accessToken);
        localStorage.setItem('refreshToken', data.login.refreshToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.login.user));
        
        // Refetch user data
        await refetchMe();
        
        return data.login;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [loginMutationFn, refetchMe]);

  const signup = useCallback(async (input: SignupInput): Promise<AuthResponse | null> => {
    try {
      const { data } = await signupMutationFn({ variables: { input } });
      if (data?.signup) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.signup.accessToken);
        localStorage.setItem('refreshToken', data.signup.refreshToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.signup.user));
        
        // Refetch user data
        await refetchMe();
        
        return data.signup;
      }
      return null;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }, [signupMutationFn, refetchMe]);

  const loginWithGoogle = useCallback(async (idToken: string): Promise<AuthResponse | null> => {
    try {
      const { data } = await loginWithGoogleMutationFn({ variables: { idToken } });
      if (data?.loginWithGoogle) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.loginWithGoogle.accessToken);
        localStorage.setItem('refreshToken', data.loginWithGoogle.refreshToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.loginWithGoogle.user));
        
        // Refetch user data
        await refetchMe();
        
        return data.loginWithGoogle;
      }
      return null;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }, [loginWithGoogleMutationFn, refetchMe]);

  const refreshToken = useCallback(async (): Promise<RefreshTokenResponse | null> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const { data } = await refreshTokenMutationFn({ 
        variables: { refreshToken: refreshTokenValue } 
      });
      
      if (data?.refreshToken) {
        // Update tokens in localStorage
        localStorage.setItem('accessToken', data.refreshToken.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken.refreshToken);
        
        return data.refreshToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      throw error;
    }
  }, [refreshTokenMutationFn]);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      await logoutMutationFn();
      
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      
      // Refetch user data (should return null)
      await refetchMe();
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear auth data even if logout fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      await refetchMe();
      return false;
    }
  }, [logoutMutationFn, refetchMe]);

  // Error handling
  const getAuthError = useCallback(() => {
    return meError || loginError || signupError || googleLoginError || refreshError || logoutError;
  }, [meError, loginError, signupError, googleLoginError, refreshError, logoutError]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    signup,
    loginWithGoogle,
    refreshToken,
    logout,
    refetchMe,
    
    // Error handling
    error: getAuthError(),
  };
};
