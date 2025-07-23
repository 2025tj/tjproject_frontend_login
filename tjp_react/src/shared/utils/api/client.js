//axios 인스턴스 설정 + 토큰 갱신 인터셉터
import axios from 'axios'
import { saveAccessFromHeaders, isTokenExpiringSoon, getAccessToken, clearAccessToken } from '@features/auth/utils'

// 인증 없이 접근 가능한 경로
const NO_AUTH_ENDPOINTS=['/login', '/signup', '/refresh']

// 1) axios 인스턴스
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // 쿠키 포함 요청 허용
})

// 리프레시 전용 인스턴스 (인터셉터 없이 오로지 쿠키만 자동 전송)
export const refreshApi = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  withCredentials: true,
})


// 2) 요청 인터셉터: 만료전 자동 refresh
api.interceptors.request.use(async(config) => {
    // 인증 없이 호출되는 엔드포인트는 토큰 붙이지 않음
    if (
        NO_AUTH_ENDPOINTS.some(url => config.url.includes(url))
    ) {
      return config
    }
    const token = getAccessToken()
    if (token && isTokenExpiringSoon(token, 120)) {
      try {
        const res = await refreshApi.post('/refresh')
        saveAccessFromHeaders(res.headers)
        const newToken = getAccessToken()
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`
        }
      } catch {
        clearAccessToken()
        window.location.href = '/login'
      } 
    } else if (token) {
      //Authorization 헤더에 붙이기
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},(error) => Promise.reject(error))

// 3) 응답 인터셉터 : 401 Unauthorized(만료)시 refresh 토큰으로 재발급 시도
api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config

    // 1) 이미 retry 중이거나, refresh 호출일 땐 그냥 원래 에러 던지기
    if (
        NO_AUTH_ENDPOINTS.some(url => originalRequest.url.includes(url))
    ) {
      return Promise.reject(error);
    }

    // 이미 재시도한 요청이 아니고, 401 에러인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // 쿠키에 담긴 refreshToken 자동 전송
        const refreshRes = await refreshApi.post('/refresh')
        // 새 accessToken을 Header에서 꺼내 저장
        saveAccessFromHeaders(refreshRes.headers)
        const newAccessToken = getAccessToken()
        if (newAccessToken) {
          // 원래 요청에도 새 토큰 실어 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // 재발급 실패 시 로그인 페이지로
        clearAccessToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api
