// 필요한 imports 추가
import { extractAccessToken, isTokenExpired } from './tokenUtils'
import { updateAccessToken } from '../store/authSlice'

let store
const getStore = () => {
  if (!store) {
    store = require('@app/store').default
  }
  return store
}

/**
 * 현재 Redux store에서 Access Token 조회
 * @returns {string|null} Access Token 또는 null
 */
export const getAccessToken = () => {
  return getStore().getState().auth.accessToken
}

/**
 * 현재 사용자 정보 조회
 * @returns {Object|null} 사용자 정보 또는 null
 */
export const getCurrentUser = () => {
  return getStore().getState().auth.user
}

/**
 * 현재 인증 상태 확인
 * @returns {boolean} 인증된 경우 true
 */
export const isAuthenticated = () => {
  return getStore().getState().auth.isAuthenticated
}

/**
 * 완전한 로그인 상태 확인 (인증됨 + 유효한 토큰)
 * @returns {boolean} 로그인된 경우 true
 */
export const isLoggedIn = () => {
  const state = getStore().getState().auth
  return state.isAuthenticated && !!state.accessToken && !isTokenExpired(state.accessToken)
}

/**
 * 응답 헤더에서 토큰을 추출하여 Redux store에 저장
 * @param {Object} headers - HTTP 응답 헤더
 * @returns {string|null} 저장된 토큰 또는 null
 */
export const saveAccessFromHeaders = (headers) => {
  const token = extractAccessToken(headers)
  if (token) {
    getStore().dispatch(updateAccessToken(token))
  }
  return token
}

/**
 * 사용자 표시명 가져오기
 * @returns {string} 사용자 표시명
 */
export const getUserDisplayName = () => {
  const user = getCurrentUser()
  return user?.nickname || user?.email || 'Unknown User'
}

/**
 * 사용자 권한 확인
 * @param {string} role - 확인할 권한
 * @returns {boolean} 권한이 있으면 true
 */
export const hasRole = (role) => {
  const user = getCurrentUser()
  return user?.roles?.includes(role) || false
}

/**
 * 이메일 인증 상태 확인
 * @returns {boolean} 이메일이 인증된 경우 true
 */
export const isEmailVerified = () => {
  const user = getCurrentUser()
  return user?.emailVerified || false
}

/**
 * 현재 앱 초기화 상태 확인
 * @returns {boolean} 초기화가 완료된 경우 true
 */
export const isAppInitialized = () => {
  return getStore().getState().auth.initialized
}

// 레거시 지원을 위한 별칭들
export const saveToken = saveAccessFromHeaders
export const removeToken = () => store.dispatch(updateAccessToken(null))
export const getToken = getAccessToken


// //---- Redux 상태 접근 ----

// /**
//  * 현재 저장된 Access Token 조회
//  * @returns {string|null} Access Token 또는 null
//  */
// export const getAccessToken = () => {
//   return store.getState().auth.accessToken
// }

// //---- redux Dispatch 래핑함수들

// /**
//  * 리덕스에 accessToken 저장
//  * @param {string} token - 저장할 토큰
//  */
// export const saveAccessToken = (token) => {
//   store.dispatch(setAccessToken(token))
// }

// /**
//  * 리덕스 accessToken 제거
//  */
// export const removeAccessToken = () => {
//   store.dispatch(clearAccessToken())
// }

// /**
//  * 사용자 정보 저장 (로그인 처리)
//  * @param {Object} user - 사용자 정보
//  */
// export const saveUserInfo = (user) => {
//   store.dispatch(login(user))
// }

// /**
//  * 사용자 정보 제거 (로그아웃 처리)
//  */
// export const removeUserInfo = () => {
//   store.dispatch(logout())
// }

// /**
//  * 경고 메시지 설정
//  * @param {string} msg - 경고 메시지
//  */
// export const setWarning = (msg) => {
//   store.dispatch(setWarningAction(msg))
// }

// /**
//  * 경고 메시지 제거
//  */
// export const clearWarning = () => {
//   store.dispatch(clearWarningAction())
// }

// /**
//  * 응답 헤더에서 AccessToken을 꺼내 리덕스에 저장
//  * @param {Object} headers - HTTP 응답 헤더
//  */
// export const saveAccessFromHeaders = (headers) => {
//   const token = extractAccessToken(headers)
//   if (token) saveAccessToken(token)
// }

// //---- 로그인 상태 확인 ----

// /**
//  * 로그인 여부 확인: 토큰존재 && 만료전
//  * @returns {boolean} 로그인 상태면 true
//  */
// export const isLoggedIn = () => {
//   const token = getAccessToken()
//   return !!token && !isTokenExpired(token)
// };

// /**
//  * 사용자 정보 조회 (users/me)
//  * @returns {Promise<import('./axios').AxiosResponse['data']|null>} 사용자 정보 또는 null
//  */
// export const checkLogin = async () => {
//     try {
//         const { api } = await import('@shared/utils/api')
//         const res = await api.get('/users/me/details')
//         return res.data
//         // return res.data.email // 예: 이메일주소
//     } catch {
//         return null
//     }
// }

// //---- 호환성을 위한 별칭 export ----
// export {
//   saveAccessToken as saveToken,
//   removeAccessToken as removeToken
// }