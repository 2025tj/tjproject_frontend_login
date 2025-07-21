// src/services/authService.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

// axios 인스턴스 생성 (선택사항 - 공통 설정)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함 (필요시)
})

export const authService = {
  // 기존 인증 API들 (예시)
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password
    })
    return response.data
  },

  signup: async (email, password, nickname) => {
    const response = await apiClient.post('/api/auth/signup', {
      email,
      password,
      nickname
    })
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout')
    return response.data
  },

  // 토큰 관련
  refreshToken: async () => {
    const response = await apiClient.post('/api/auth/refresh')
    return response.data
  },

  validateToken: async () => {
    const response = await apiClient.get('/api/auth/validate')
    return response.data
  },

  // 이메일 인증 관련
  verifyEmail: async (token) => {
    const response = await apiClient.post('/api/email/verify', null, {
      params: { token }
    })
    return response.data
  },

  resendEmailVerification: async () => {
    const response = await apiClient.post('/api/email/resend-verification')
    return response.data
  },

  // 🆕 비밀번호 재설정 관련
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/api/auth/password/reset-request', {
      email
    })
    return response.data
  },

  validatePasswordResetToken: async (token) => {
    const response = await apiClient.get('/api/auth/password/validate-token', {
      params: { token }
    })
    return response.data
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await apiClient.post('/api/auth/password/reset', {
      token,
      newPassword,
      confirmPassword
    })
    return response.data
  },
}

// 에러 인터셉터 (선택사항)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그인 페이지로 리다이렉트 등
      console.log('인증이 필요합니다.')
    }
    return Promise.reject(error)
  }
)

export default authService