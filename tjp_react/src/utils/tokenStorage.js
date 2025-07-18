import axios from "axios"
import store from '../app/store'

// const ACCESS_KEY = 'accessToken'
// let accessToken= null

/**
 * Access Token 저장
 * @param {string} token
 */
// export function setAccessToken(token) {
//   // 1) 로컬스토리지에 저장
//   // localStorage.setItem(ACCESS_KEY, token)
//   // 2) axios 전역헤더에도 반영
//   // accessToken = token
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
// }

/**
 * Access Token 조회
//  * @returns {string|null}
//  */
// export function getAccessToken() {
//   // return localStorage.getItem(ACCESS_KEY)
//   // return accessToken
//   return store.getState().auth.accessToken
// }

/**
 * Access Token 제거
 */
// export function clearAccessToken() {
//   // localStorage.removeItem(ACCESS_KEY)
//   // accessToken = null
//   delete axios.defaults.headers.common['Authorization']
// }