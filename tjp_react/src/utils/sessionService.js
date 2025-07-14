// src/utils/sessionService.js
import api from './axios'
import { clearAccessToken } from './tokenStorage'

/**
 * 서버에 토큰 검증 요청: 백엔드로 서명, 블랙리스트 검증
 * @returns {Promise<boolean>} 유효하면 true
 */
export async function validateOnServer() {
  try {
    await api.get('/auth/validate')  // 별도 엔드포인트 구현 필요
    return true
  } catch {
    clearAccessToken()
    return false
  }
}

