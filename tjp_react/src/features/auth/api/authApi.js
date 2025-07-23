import {api} from '@shared/utils/api/client.js'
import {} from '@features/auth/utils/token'
import { clearAccessToken, saveAccessFromHeaders } from '../utils';

export const authApi = {
    /**
   * 회원가입
   * @param {Object} userData - 회원가입 데이터
   * @param {string} userData.email - 이메일
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.confirmPassword - 비밀번호 확인
   * @param {string} userData.nickname - 닉네임
   */
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  },

  /**
   * 로그인
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.email - 이메일
   * @param {string} credentials.password - 비밀번호
   */
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    // Access Token 저장
    saveAccessFromHeaders(response.headers)
    return response.data;
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
        console.warn('서버 로그아웃 실패:', err);
    } finally {
      // 토큰 제거 (API 실패해도 로컬 토큰은 제거)
      clearAccessToken()
      window.location.href = '/login';
    }
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async () => {
    const response = await api.post('/api/auth/refresh')
    return response.data
  },

  /**
   * 토큰 검증
   */
  validateToken: async () => {
    const response = await api.get('/api/auth/validate')
    return response.data
  },

  /**
   * OAuth2 완료 처리
   */
  oauth2Complete: async () => {
    const response = await api.get('/api/auth/oauth2/complete')
    return response.data
  },

  /**
   * 비밀번호 재설정 요청
   * @param {string} email - 이메일
   */
  requestPasswordReset: async (email) => {
    const response = await api.post('/api/auth/password/reset-request', { email })
    return response.data
  },

  /**
   * 비밀번호 재설정 토큰 검증
   * @param {string} token - 재설정 토큰
   */
  validatePasswordResetToken: async (token) => {
    const response = await api.get(`/api/auth/password/validate-token?token=${token}`)
    return response.data
  },

  /**
   * 비밀번호 재설정 실행
   * @param {Object} resetData - 재설정 데이터
   * @param {string} resetData.token - 재설정 토큰
   * @param {string} resetData.newPassword - 새 비밀번호
   * @param {string} resetData.confirmPassword - 새 비밀번호 확인
   */
  resetPassword: async (resetData) => {
    const response = await api.post('/api/auth/password/reset', resetData)
    return response.data
  },
}