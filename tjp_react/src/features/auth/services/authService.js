import { authApi } from '../api/authApi'
import { userApi } from '@features/user/api/userApi'
import { ApiError } from '@shared/errors/ApiError'
import { unwrapApiResponse } from '@shared/utils/api'
import {
  saveAccessFromHeaders,
  clearAccessToken,
  getAccessToken,
  isTokenExpired
} from '../utils'

export const authService = {
  loginAndFetchUser: async (credentials) => {
    const res = await authApi.login(credentials)
    saveAccessFromHeaders(res.headers)
    unwrapApiResponse(res.data) // 로그인 결과만 확인

    const user = await userApi.getProfile() // 실제 사용자 정보 조회
    // saveUserInfo(user)
    return user
  },

  signupOnly: async (userData) => {
    try {
        const res = await authApi.signup(userData)
        return unwrapApiResponse(res)
    } catch (err) {
      // AxiosError인지 확인하고 ApiError로 감싸기
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },

  logoutAndClear: async () => {
    await authApi.logout()
    clearAccessToken()
    window.location.href = '/login'
  },

  isAuthenticated: () => {
    const token = getAccessToken()
    return !!token && !isTokenExpired(token)
  },

  getToken: () => {
    return getAccessToken()
  },

  tryRestoreUser: async () => {
    const token = getAccessToken()
    if (!token || isTokenExpired(token)) {
      try {
        const refreshed = await authApi.refreshToken()
        saveAccessFromHeaders(refreshed.headers)
      } catch {
        clearAccessToken()
        return null
      }
    }

    try {
      const user = await userApi.getProfile()
      return user
    } catch {
      return null
    }
  },
  //OAuth2 로그인 완료 후 토큰 수신 + 유저 조회
  oauth2CompleteAndFetchUser: async () => {
    try {
      await authApi.oauth2Complete() // 토큰만 헤더로 받음
      const user = await userApi.getProfile()
      return user
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  //비밀번호 재설정 메일 요청
  requestPasswordReset: async (email) => {
    try {
      return await authApi.requestPasswordReset(email)
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  // 비밀번호 재설정 토큰 검증
  validateResetToken: async (token) => {
    try {
      return await authApi.validatePasswordResetToken(token)
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  // 비밀번호 재설정 실행
  resetPassword: async (resetData) => {
    try {
      return await authApi.resetPassword(resetData)
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  refreshToken: async () => {
    try {
      const res = await authApi.refreshToken()
      saveAccessFromHeaders(res.headers)
      return true
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  validateToken: async () => {
    try {
      return await authApi.validateToken()
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  }
}
