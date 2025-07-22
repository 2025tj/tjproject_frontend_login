import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api';
// import { saveAccessFromHeaders, saveUserInfo, removeUserInfo, removeAccessToken } from '../utils';
import { saveAccessFromHeaders, saveUserInfo, removeAccessToken, removeUserInfo } from '../utils'

// 로그인 thunk
export const loginThunk = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
        
            // 토큰 저장
            saveAccessFromHeaders(response.headers);
            
            // 사용자 정보 조회
            const userResponse = await authApi.getProfile();
            const user = userResponse.data;
            
            return {
                user,
                accessToken: response.headers['access-token'],
                warning: response.data.warning
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '로그인 실패');
        }
    }
)

// 로그아웃 thunk
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('서버 로그아웃 실패:', error);
    } finally {
      // 클라이언트 정리는 항상 실행
      removeUserInfo();
      removeAccessToken();
    }
  }
)

// 토큰 갱신 thunk
export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.refresh();
      saveAccessFromHeaders(response.headers);
      
      return {
        accessToken: response.headers['access-token']
      };
    } catch (error) {
      removeAccessToken();
      return rejectWithValue('토큰 갱신 실패');
    }
  }
)

// 회원가입 thunk
export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      await authApi.signup(userData);
      return { message: '회원가입 성공' };
    } catch (error) {
      return rejectWithValue(error.response?.data || '회원가입 실패');
    }
  }
)

// 비밀번호 재설정 요청 thunk
export const requestPasswordResetThunk = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      await authApi.requestPasswordReset(email);
      return { message: '재설정 링크가 발송되었습니다.' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요청 실패');
    }
  }
)

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      await authApi.resetPassword(token, newPassword, confirmPassword)
      return { message: '비밀번호가 성공적으로 재설정되었습니다.' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '재설정 실패')
    }
  }
)