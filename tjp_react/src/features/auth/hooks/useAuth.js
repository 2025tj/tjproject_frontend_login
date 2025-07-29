import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo } from 'react'
import {
  // Thunks
  loginThunk,
  logoutThunk,
  signupThunk,
  refreshTokenThunk,
  initializeAuthThunk,
  validateTokenThunk,
  requestPasswordResetThunk,
  resetPasswordThunk,
  completeOAuth2Thunk,
  // linkSocialAccountThunk,
  // Actions
  clearError,
  clearWarning,
  setWarning,
  resetAuthState,
  // Selectors
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectWarning,
  selectIsLoggedIn,
  selectAccessToken,
  selectAuthInitialized
} from '../store'

export const useAuth = () => {
  const dispatch = useDispatch()
  
  // 상태 선택
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const warning = useSelector(selectWarning)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const accessToken = useSelector(selectAccessToken)
  const initialized = useSelector(selectAuthInitialized)
  
  // 기본 인증 액션들
  const authActions = useMemo(() => ({
    // 앱 초기화
    initialize: () => dispatch(initializeAuthThunk()),
    
    // 로그인/로그아웃
    login: (credentials) => dispatch(loginThunk(credentials)),
    logout: () => dispatch(logoutThunk()),
    
    // 회원가입
    signup: (userData) => dispatch(signupThunk(userData)),
    
    // 토큰 관리
    refreshToken: () => dispatch(refreshTokenThunk()),
    validateToken: () => dispatch(validateTokenThunk()),
    
    // 비밀번호 재설정
    requestPasswordReset: (email) => dispatch(requestPasswordResetThunk(email)),
    resetPassword: (token, newPassword, confirmPassword) => 
      dispatch(resetPasswordThunk({ token, newPassword, confirmPassword })),
    
    // OAuth2
    completeOAuth2: () => dispatch(completeOAuth2Thunk()),
    // linkSocialAccount: (email, password, provider) =>
    //   dispatch(linkSocialAccountThunk({ email, password, provider })),
    
    // 상태 관리
    clearError: () => dispatch(clearError()),
    clearWarning: () => dispatch(clearWarning()),
    setWarning: (message) => dispatch(setWarning(message)),
    resetAuth: () => dispatch(resetAuthState())
  }), [dispatch])

  // 편의 메서드들
  const utils = useMemo(() => ({
    // 로그인 여부 확인 (토큰 존재 + 인증됨)
    isUserLoggedIn: () => isAuthenticated && !!accessToken,
    
    // 사용자 표시명
    getUserDisplayName: () => user?.nickname || user?.email || 'Unknown',
    
    // 이메일 인증 여부
    isEmailVerified: () => user?.emailVerified || false,
    
    // 사용자 권한
    getUserRoles: () => user?.roles || [],
    
    // 특정 권한 확인
    hasRole: (role) => user?.roles?.includes(role) || false
  }), [user, isAuthenticated, accessToken])

  return {
    // 상태
    user,
    isAuthenticated,
    isLoggedIn,
    loading,
    error,
    warning,
    accessToken,
    initialized,
    
    // 액션들
    ...authActions,
    
    // 유틸리티
    ...utils
  }
}



//   // 액션 디스패치 함수들
//   const login = useCallback((credentials) => {
//     return dispatch(loginThunk(credentials));
//   }, [dispatch]);
  
//   const logout = useCallback(() => {
//     return dispatch(logoutThunk());
//   }, [dispatch]);
  
//   const signup = useCallback((userData) => {
//     return dispatch(signupThunk(userData));
//   }, [dispatch]);
  
//   const refreshToken = useCallback(() => {
//     return dispatch(refreshTokenThunk());
//   }, [dispatch]);
  
//   const clearAuthError = useCallback(() => {
//     dispatch(clearError());
//   }, [dispatch]);
  
//   const clearAuthWarning = useCallback(() => {
//     dispatch(clearWarning());
//   }, [dispatch]);
  
//   const setAuthWarning = useCallback((message) => {
//     dispatch(setWarning(message));
//   }, [dispatch]);
  
//     const requestPasswordReset = useCallback((email) => {
//     return dispatch(requestPasswordResetThunk(email))
//   }, [dispatch])
  
//   const resetPassword = useCallback((token, newPassword, confirmPassword) => {
//     return dispatch(resetPasswordThunk({ token, newPassword, confirmPassword }))
//   }, [dispatch])

//   return {
//     // 상태
//     user,
//     isAuthenticated,
//     isLoggedIn,
//     loading,
//     error,
//     warning,
    
//     // 액션들
//     login,
//     logout,
//     signup,
//     refreshToken,
//     clearError: clearAuthError,
//     clearWarning: clearAuthWarning,
//     setWarning: setAuthWarning,
//     requestPasswordReset,
//     resetPassword,
//   };
// };