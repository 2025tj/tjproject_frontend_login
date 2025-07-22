import { jwtDecode } from 'jwt-decode'

/**
 * JWT 토큰이 만료되었는지 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} 만료되었으면 true
 */
export function isTokenExpired(token) {
  if (!token) return true
  
  try {
    const { exp } = jwtDecode(token)
    const currentTime = Math.floor(Date.now() / 1000)
    return currentTime >= exp
  } catch (error) {
    console.warn('토큰 디코드 실패:', error)
    return true
  }
}

/**
 * JWT 토큰이 곧 만료되는지 확인
 * @param {string} token - JWT 토큰
 * @param {number} bufferSeconds - 만료 전 버퍼 시간(초), 기본 120초
 * @returns {boolean} 곧 만료되면 true
 */
export function isTokenExpiringSoon(token, bufferSeconds = 120) {
  if (!token) return true
  
  try {
    const { exp } = jwtDecode(token)
    const currentTime = Math.floor(Date.now() / 1000)
    return (exp - currentTime) <= bufferSeconds
  } catch (error) {
    console.warn('토큰 디코드 실패:', error)
    return true
  }
}

/**
 * HTTP 응답 헤더에서 Access Token 추출
 * @param {Object} headers - HTTP 응답 헤더
 * @returns {string|null} 추출된 토큰 또는 null
 */
export function extractAccessToken(headers) {
  if (!headers) return null
  
  const tokenHeader = headers['access-token'] || 
                     headers['Access-Token'] || 
                     headers['authorization'] ||
                     headers['Authorization']
  
  if (!tokenHeader) return null
  
  // Bearer 프리픽스 제거
  return tokenHeader.startsWith('Bearer ') 
    ? tokenHeader.slice(7) 
    : tokenHeader
}

/**
 * JWT 토큰에서 사용자 정보 추출
 * @param {string} token - JWT 토큰
 * @returns {Object|null} 토큰 페이로드 또는 null
 */
export function getTokenPayload(token) {
  if (!token) return null
  
  try {
    return jwtDecode(token)
  } catch (error) {
    console.warn('토큰 디코드 실패:', error)
    return null
  }
}

/**
 * 토큰의 남은 유효시간(초) 계산
 * @param {string} token - JWT 토큰
 * @returns {number} 남은 시간(초), 만료된 경우 0
 */
export function getTokenRemainingTime(token) {
  if (!token) return 0
  
  try {
    const { exp } = jwtDecode(token)
    const currentTime = Math.floor(Date.now() / 1000)
    const remainingTime = exp - currentTime
    return Math.max(0, remainingTime)
  } catch (error) {
    console.warn('토큰 디코드 실패:', error)
    return 0
  }
}