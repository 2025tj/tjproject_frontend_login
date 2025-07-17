import api from './axios'
import * as jwtDecode from 'jwt-decode'
import { getAccessToken, setAccessToken, clearAccessToken } from './tokenStorage';
import axios from 'axios';

/**
 * 응답 헤더에서 AccessToken을 꺼내 로컬스토리지에 저장
 * @param {import('axios').AxiosResponseHeaders} headers
 */
export const saveAccessFromHeaders = (headers) => {
    const raw = headers['access-token'] || headers['Access-Token'];
    if (!raw) return


    // 서버로부터 Bearer <accessToken>형식으로 받았음
    const accessToken = raw.startsWith('Bearer ') 
    ? raw.substring(7)
    : raw

    // 로컬 스토리지에 저장
    setAccessToken(accessToken)
}

/**
 * 토큰이 만료되었는지 확인
 * @returns {boolean} 만료되었으면 true
 */
export function isTokenExpired() {
  const token = getAccessToken()
  if (!token) return true
  try {
    const { exp } = jwtDecode(token)
    return Date.now() / 1000 > exp
  } catch {
    return true
  }
}

/**
 * 로그인 여부 확인: 토큰존재 && 만료전
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return !!getAccessToken() && !isTokenExpired();
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

export {
  getAccessToken as getToken,
  setAccessToken as saveToken,
  clearAccessToken as removeToken
}