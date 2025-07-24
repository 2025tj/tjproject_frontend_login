import {api, postAndUnwrap} from '@shared/utils/api'
import { clearAccessToken, saveAccessFromHeaders } from '../utils';
import { getAndUnwrap, unwrapApiResponse } from '../../../shared/utils/api';

export const authApi = {
    /**
   * 회원가입
   * @param {Object} userData - 회원가입 데이터
   * @param {string} userData.email - 이메일
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.confirmPassword - 비밀번호 확인
   * @param {string} userData.nickname - 닉네임
   */
  signup: (userData) => postAndUnwrap('/api/auth/signup', userData),

  /**
   * 로그인
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.email - 이메일
   * @param {string} credentials.password - 비밀번호
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Access Token 저장
    saveAccessFromHeaders(response.headers)
    return unwrapApiResponse(response.data);
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      await postAndUnwrap('/api/auth/logout')
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
  refreshToken: () => postAndUnwrap('/api/auth/refresh'),

  /**
   * 토큰 검증
   */
  validateToken: () => getAndUnwrap('/api/auth/validate'),

  /**
   * OAuth2 완료 처리
   */
  oauth2Complete: () => getAndUnwrap('/api/auth/oauth2/complete'),

  /**
   * 비밀번호 재설정 요청
   * @param {string} email - 이메일
   */
  requestPasswordReset: (email) =>
    postAndUnwrap('/api/auth/password/reset-request', { email }),

  /**
   * 비밀번호 재설정 토큰 검증
   * @param {string} token - 재설정 토큰
   */
  validatePasswordResetToken: (token) =>
    getAndUnwrap(`/api/auth/password/validate-token?token=${token}`),

  /**
   * 비밀번호 재설정 실행
   * @param {Object} resetData - 재설정 데이터
   * @param {string} resetData.token - 재설정 토큰
   * @param {string} resetData.newPassword - 새 비밀번호
   * @param {string} resetData.confirmPassword - 새 비밀번호 확인
   */
  resetPassword: (resetData) =>
    postAndUnwrap('/api/auth/password/reset', resetData),
}