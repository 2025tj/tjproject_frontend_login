import api from './axios'
import * as jwtDecode from 'jwt-decode'
import { getAccessToken as getTokenFromStore } from './tokenStorage';
import axios from 'axios';
import { 
  login as loginAction,
  logout as logoutAction,
  setAccessToken as setAccessTokenAction,
  clearAccessToken as clearAccessTokenAction,
  setWarning as setWarningAction,
  clearWarning as clearWarningAction,
 } from '../features/auth/authSlice';
import store from '../app/store';

//---- 토큰 유틸들 ----

export const isTokenExpiringSoon = (token, buffer = 120)=> {
  try {
    const { exp} =jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    return exp - now < buffer
  } catch {
    return true
  }
}

/**
 * 토큰이 만료되었는지 확인
 * @returns {boolean} 만료되었으면 true
 */
export function isTokenExpired() {
  const token = getTokenFromStore()
  if (!token) return true
  try {
    const { exp } = jwtDecode(token)
    return Date.now() / 1000 > exp
  } catch {
    return true
  }
}

export const extractAccessToken = (headers) => {
  const raw = headers['access-token'] || headers['Access-Token']
  return raw?.startsWith('Bearer ') ? raw.slice(7) : raw
}


// Access Token getter
export const getAccessToken = () => {
  return store.getState().auth.accessToken
}


//---- redux Dispatch 래핑함수들

// 리덕스에 accessToken 저장
export const saveAccessToken = (token) => {
  store.dispatch(setAccessTokenAction(token))
}

// 리덕스 accessToken 제거
export const removeAccessToken = () => {
  store.dispatch(clearAccessTokenAction())
}
// 응답 헤더에서 AccessToken을 꺼내 리덕스에 저장
export const saveAccessFromHeaders = (headers) => {
  const token = extractAccessToken(headers)
  if (token) saveAccessToken(token)
}

export const saveUserInfo = (user) => {
  store.dispatch(loginAction(user))
}

export const removeUserInfo = () => {
  store.dispatch(logoutAction())
}

export const setWarning = (msg) => {
  store.dispatch(setWarningAction(msg))
}

export const clearWarning = () => {
  store.dispatch(clearWarningAction())
}


/**
 * 로그인 여부 확인: 토큰존재 && 만료전
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return !!getTokenFromStore() && !isTokenExpired();
};

/**
 * 사용자 정보 조회 (users/me)
 * @returns {Promise<import('./axios').AxiosResponse['data']|null>}
 */
export const checkLogin = async () => {
    try {
        const res = await api.get('/auth/me')
        return res.data
        // return res.data.email // 예: 이메일주소
    } catch {
        return null
    }
}

// /**
//  * 응답 헤더에서 AccessToken을 꺼내 리덕스에 저장
//  * @param {import('axios').AxiosResponseHeaders} headers
//  */
// export const saveAccessFromHeaders = (headers) => {
//     const raw = headers['access-token'] || headers['Access-Token'];
//     if (!raw) return


//     // 서버로부터 Bearer <accessToken>형식으로 받았음
//     const accessToken = raw.startsWith('Bearer ') 
//     ? raw.substring(7)
//     : raw

//     // 리덕스에 저장
//     store.dispatch(setAccessTokenAction(accessToken))
// }


export {
  getTokenFromStore as getToken,
  saveAccessToken as saveToken,
  removeAccessToken as removeToken
}