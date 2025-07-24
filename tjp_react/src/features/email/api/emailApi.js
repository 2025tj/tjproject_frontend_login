import { getAndUnwrap, postAndUnwrap } from '@shared/utils/api'

export const emailApi = {
  /**
   * 이메일 인증 토큰 검증 (링크 클릭 시 사용)
   * GET /api/email/verify?token=...
   * @param {string} token - 이메일 인증 토큰
   * @returns {Promise<string>} 인증 성공/실패 메시지
   */
  verifyEmailToken: (token) =>
    getAndUnwrap(`/api/email/verify?token=${encodeURIComponent(token)}`),

  /**
   * 인증 메일 재발송
   * POST /api/email/resend-verification
   * @returns {Promise<string>} 성공/실패 메시지
   */
  resendVerificationEmail: () =>
    postAndUnwrap('/api/email/resend-verification'),
}