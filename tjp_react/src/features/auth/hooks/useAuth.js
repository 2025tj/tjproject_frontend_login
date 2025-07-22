import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  loginThunk,
  logoutThunk,
  signupThunk,
  refreshTokenThunk,
  clearError,
  clearWarning,
  setWarning,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectWarning,
  selectIsLoggedIn,
  requestPasswordResetThunk,
  resetPasswordThunk
} from '../store';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // 상태 선택
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const warning = useSelector(selectWarning);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  
  // 액션 디스패치 함수들
  const login = useCallback((credentials) => {
    return dispatch(loginThunk(credentials));
  }, [dispatch]);
  
  const logout = useCallback(() => {
    return dispatch(logoutThunk());
  }, [dispatch]);
  
  const signup = useCallback((userData) => {
    return dispatch(signupThunk(userData));
  }, [dispatch]);
  
  const refreshToken = useCallback(() => {
    return dispatch(refreshTokenThunk());
  }, [dispatch]);
  
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  const clearAuthWarning = useCallback(() => {
    dispatch(clearWarning());
  }, [dispatch]);
  
  const setAuthWarning = useCallback((message) => {
    dispatch(setWarning(message));
  }, [dispatch]);
  
    const requestPasswordReset = useCallback((email) => {
    return dispatch(requestPasswordResetThunk(email))
  }, [dispatch])
  
  const resetPassword = useCallback((token, newPassword, confirmPassword) => {
    return dispatch(resetPasswordThunk({ token, newPassword, confirmPassword }))
  }, [dispatch])

  return {
    // 상태
    user,
    isAuthenticated,
    isLoggedIn,
    loading,
    error,
    warning,
    
    // 액션들
    login,
    logout,
    signup,
    refreshToken,
    clearError: clearAuthError,
    clearWarning: clearAuthWarning,
    setWarning: setAuthWarning,
    requestPasswordReset,
    resetPassword,
  };
};