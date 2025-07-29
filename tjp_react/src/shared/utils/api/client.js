//axios 인스턴스 설정 + 토큰 갱신 인터셉터
import axios from 'axios'
import { saveAccessFromHeaders, isTokenExpiringSoon, getAccessToken, clearAccessToken } from '@features/auth/utils'

// 인증 없이 접근 가능한 경로
const NO_AUTH_ENDPOINTS=['/auth/login', '/auth/signup', '/auth/refresh']

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

let onAuthError = null // 콜백 초기화

export const setAuthErrorHandler = (fn) => {
  onAuthError = fn
}

// 요청 인터셉터 - 디버깅 로그 포함
api.interceptors.request.use(
  async (config) => {
    console.log('🚀 [API Client] 요청 시작:', config.method?.toUpperCase(), config.url)
    
    // 현재 저장된 토큰 확인
    const token = getAccessToken()
    console.log('🔍 [API Client] 저장된 토큰:', token ? `${token.substring(0, 20)}...` : 'null')
    
    if (token) {
      // Authorization 헤더에 토큰 포함
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ [API Client] Authorization 헤더 설정됨:', `Bearer ${token.substring(0, 20)}...`)
      
      // 토큰 만료 확인
      if (isTokenExpiringSoon(token, 120)) {
        console.log('⏰ [API Client] 토큰 만료 임박 - 갱신 시도')
        try {
          const refreshRes = await refreshApi.post('/refresh')
          const newToken = saveAccessFromHeaders(refreshRes.headers)
          
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`
            console.log('🔄 [API Client] 토큰 갱신 성공')
          }
        } catch (err) {
          console.warn('⚠️ [API Client] 토큰 갱신 실패:', err)
        }
      }
    } else {
      console.warn('⚠️ [API Client] 토큰이 없습니다 - Authorization 헤더 없이 요청')
    }
    
    console.log('🔍 [API Client] 최종 요청 헤더:', config.headers)
    return config
  },
  (error) => {
    console.error('❌ [API Client] 요청 인터셉터 에러:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 디버깅 로그 포함
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API Client] 응답 성공:', {
      url: response.config.url,
      status: response.status,
      hasHeaders: !!response.headers
    })
    
    // 인증 관련 응답 처리
    const authUrls = ['/auth/login', '/auth/refresh', '/auth/oauth2/complete']
    const isAuthResponse = authUrls.some(url => response.config.url?.includes(url))
    
    if (isAuthResponse) {
      console.log('🔐 [API Client] 인증 응답 감지')
      console.log('🔍 [API Client] 응답 헤더 상세:', response.headers)
      
      if (response.headers) {
        // 헤더 키들 확인
        const headerKeys = Object.keys(response.headers)
        console.log('🔍 [API Client] 헤더 키 목록:', headerKeys)
        
        // 특정 토큰 헤더들 확인
        const tokenHeaders = ['Access-Token', 'access-token', 'Authorization', 'authorization']
        tokenHeaders.forEach(headerName => {
          if (response.headers[headerName]) {
            console.log(`🔍 [API Client] ${headerName} 헤더 발견:`, response.headers[headerName])
          }
        })
        
        const savedToken = saveAccessFromHeaders(response.headers)
        if (savedToken) {
          console.log('✅ [API Client] 토큰 저장 성공:', `${savedToken.substring(0, 20)}...`)
        } else {
          console.warn('⚠️ [API Client] 토큰 저장 실패 - 헤더에서 토큰을 찾을 수 없음')
          console.warn('⚠️ [API Client] 사용 가능한 헤더:', headerKeys)
        }
      } else {
        console.warn('⚠️ [API Client] 인증 응답에 헤더가 없음')
      }
    }
    
    return response
  },
  async (error) => {
    console.error('❌ [API Client] 응답 에러:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    })

    // 401 에러 처리
    if (error.response?.status === 401) {
      console.log('🔐 [API Client] 401 Unauthorized - 토큰 문제 가능성')
      
      const originalRequest = error.config
      const excludeUrls = ['/login', '/signup', '/refresh']
      
      if (!excludeUrls.some(url => originalRequest.url?.includes(url)) && !originalRequest._retry) {
        console.log('🔄 [API Client] 토큰 갱신 및 재시도 시작')
        originalRequest._retry = true

        try {
          const refreshRes = await refreshApi.post('/refresh')
          const newToken = saveAccessFromHeaders(refreshRes.headers)
          
          if (newToken) {
            console.log('✅ [API Client] 토큰 갱신 성공 - 요청 재시도')
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          console.error('❌ [API Client] 토큰 갱신 실패:', refreshError)
          clearAccessToken()
          
          if (!window.location.pathname.includes('/login')) {
            console.log('🔄 [API Client] 로그인 페이지로 리다이렉트')
            window.location.href = '/login'
          }
        }
      }
    }
    
    return Promise.reject(error)
  }
)
// // 2) 요청 인터셉터: 만료전 자동 refresh
// api.interceptors.request.use(async(config) => {
//     // 인증 없이 호출되는 엔드포인트는 토큰 붙이지 않음
//     if (
//         NO_AUTH_ENDPOINTS.some(url => config.url.includes(url))
//     ) {
//       return config
//     }
//     const token = getAccessToken()
//     if (token && isTokenExpiringSoon(token, 120)) {
//       try {
//         const res = await refreshApi.post('/refresh')
//         saveAccessFromHeaders(res.headers)
//         const newToken = getAccessToken()
//         if (newToken) {
//           config.headers.Authorization = `Bearer ${newToken}`
//         }
//       } catch {
//         clearAccessToken()
//         // window.location.href = '/login'
//         onAuthError?.() // 콜백 실행
//       } 
//     } else if (token) {
//       //Authorization 헤더에 붙이기
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// },(error) => Promise.reject(error))

// // 3) 응답 인터셉터 : 401 Unauthorized(만료)시 refresh 토큰으로 재발급 시도
// api.interceptors.response.use(
//   res => res,
//   async (error) => {
//     const originalRequest = error.config

//     // 1) 이미 retry 중이거나, refresh 호출일 땐 그냥 원래 에러 던지기
//     if (
//         NO_AUTH_ENDPOINTS.some(url => originalRequest.url.includes(url))
//     ) {
//       return Promise.reject(error);
//     }

//     // 이미 재시도한 요청이 아니고, 401 에러인 경우
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         // 쿠키에 담긴 refreshToken 자동 전송
//         const refreshRes = await refreshApi.post('/refresh')
//         // 새 accessToken을 Header에서 꺼내 저장
//         saveAccessFromHeaders(refreshRes.headers)
//         const newAccessToken = getAccessToken()
//         if (newAccessToken) {
//           // 원래 요청에도 새 토큰 실어 재시도
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
//           return api(originalRequest)
//         }
//       } catch (refreshError) {
//         // 재발급 실패 시 로그인 페이지로
//         clearAccessToken()
//         // window.location.href = '/login'
//         onAuthError?.() // 콜백 실행
//         return Promise.reject(refreshError)
//       }
//     }
//     return Promise.reject(error)
//   }
// )

export default api
