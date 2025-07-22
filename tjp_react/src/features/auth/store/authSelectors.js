import { createSelector } from '@reduxjs/toolkit';

// 기본 셀렉터들
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAccessToken = (state) => state.auth.accessToken
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectWarning = (state) => state.auth.warning
export const selectAuthInitialized = (state) => state.auth.initialized

// 복합 셀렉터들
export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.roles || []
)

export const selectIsEmailVerified = createSelector(
  [selectUser],
  (user) => user?.emailVerified || false
)

export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => user?.nickname || user?.email || 'Unknown'
)

// 완전한 로그인 상태 (인증됨 + 토큰 존재)
export const selectIsLoggedIn = createSelector(
  [selectIsAuthenticated, selectAccessToken],
  (isAuthenticated, token) => isAuthenticated && !!token
)

// 권한 관련 셀렉터들
export const selectHasRole = (role) => createSelector(
  [selectUserRole],
  (roles) => roles.includes(role)
)

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (roles) => roles.includes('ADMIN')
)

// 앱 준비 상태 (초기화 완료 + 로딩 없음)
export const selectIsAppReady = createSelector(
  [selectAuthInitialized, selectAuthLoading],
  (initialized, loading) => initialized && !loading
)

// 에러/경고 상태
export const selectHasError = createSelector(
  [selectAuthError],
  (error) => !!error
)

export const selectHasWarning = createSelector(
  [selectWarning],
  (warning) => !!warning
)