import { useMutation, useQuery } from '@apollo/client/react';
import { useCallback } from 'react';
import { 
  loginMutation, 
  signupMutation, 
  loginWithGoogleMutation,
  refreshTokenMutation,
  logoutMutation,
  meQuery 
} from '../lib/graphql/operations';
import { 
  LoginInput, 
  SignupInput, 
  AuthResponse, 
  RefreshTokenResponse,
  User 
} from '../types/graphql';

export const useAuth = () => {
  // Queries
  const { data: meData, loading: meLoading, error: meError, refetch: refetchMe } = useQuery(meQuery, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  }) as any;

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
      const { data } = await loginMutationFn({ variables: { input } }) as any;
      // console.log(data)
      if (data?.login) {     
        // Refetch user data
        const {data: meData} = await refetchMe();
        
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
      const { data } = await signupMutationFn({ variables: { input } }) as any;
      if (data?.signup) {
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
      const { data } = await loginWithGoogleMutationFn({ variables: { idToken } }) as any;
      if (data?.loginWithGoogle) {
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
      // const refreshTokenValue = localStorage.getItem('refreshToken');
      // if (!refreshTokenValue) {
      //   throw new Error('No refresh token available');
      // }
      const { data } = await refreshTokenMutationFn() as any;
      
      if (data?.refreshToken) {        
        return data.refreshToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }, [refreshTokenMutationFn]);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const {data} = await logoutMutationFn();
      console.log(data)
      // Refetch user data (should return null)
      await refetchMe();
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
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
