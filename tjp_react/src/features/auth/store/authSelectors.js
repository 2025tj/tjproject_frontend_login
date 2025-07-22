import { createSelector } from '@reduxjs/toolkit';

// 기본 셀렉터들
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectWarning = (state) => state.auth.warning;

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

// 인증 상태 관련
export const selectIsLoggedIn = createSelector(
  [selectIsAuthenticated, selectAccessToken],
  (isAuthenticated, token) => isAuthenticated && !!token
)