import store from '@app/store'
import { 
    setAccessToken, 
    clearAccessToken, 
    login, 
    logout, 
    setWarning as setWarningAction, 
    clearWarning as clearWarningAction 
} from '../store/authSlice'
import { extractAccessToken, isTokenExpired } from './tokenUtils'

//---- Redux 상태 접근 ----

/**
 * 현재 저장된 Access Token 조회
 * @returns {string|null} Access Token 또는 null
 */
export const getAccessToken = () => {
  return store.getState().auth.accessToken
}

//---- redux Dispatch 래핑함수들

/**
 * 리덕스에 accessToken 저장
 * @param {string} token - 저장할 토큰
 */
export const saveAccessToken = (token) => {
  store.dispatch(setAccessToken(token))
}

/**
 * 리덕스 accessToken 제거
 */
export const removeAccessToken = () => {
  store.dispatch(clearAccessToken())
}

/**
 * 사용자 정보 저장 (로그인 처리)
 * @param {Object} user - 사용자 정보
 */
export const saveUserInfo = (user) => {
  store.dispatch(login(user))
}

/**
 * 사용자 정보 제거 (로그아웃 처리)
 */
export const removeUserInfo = () => {
  store.dispatch(logout())
}

/**
 * 경고 메시지 설정
 * @param {string} msg - 경고 메시지
 */
export const setWarning = (msg) => {
  store.dispatch(setWarningAction(msg))
}

/**
 * 경고 메시지 제거
 */
export const clearWarning = () => {
  store.dispatch(clearWarningAction())
}

/**
 * 응답 헤더에서 AccessToken을 꺼내 리덕스에 저장
 * @param {Object} headers - HTTP 응답 헤더
 */
export const saveAccessFromHeaders = (headers) => {
  const token = extractAccessToken(headers)
  if (token) saveAccessToken(token)
}

//---- 로그인 상태 확인 ----

/**
 * 로그인 여부 확인: 토큰존재 && 만료전
 * @returns {boolean} 로그인 상태면 true
 */
export const isLoggedIn = () => {
  const token = getAccessToken()
  return !!token && !isTokenExpired(token)
};

/**
 * 사용자 정보 조회 (users/me)
 * @returns {Promise<import('./axios').AxiosResponse['data']|null>} 사용자 정보 또는 null
 */
export const checkLogin = async () => {
    try {
        const { api } = await import('@shared/utils/api')
        const res = await api.get('/users/me/details')
        return res.data
        // return res.data.email // 예: 이메일주소
    } catch {
        return null
    }
}

//---- 호환성을 위한 별칭 export ----
export {
  saveAccessToken as saveToken,
  removeAccessToken as removeToken
}