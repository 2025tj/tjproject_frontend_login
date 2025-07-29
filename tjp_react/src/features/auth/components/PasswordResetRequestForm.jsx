import React, { useState } from 'react'
import { authService } from '../services'

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { requestPasswordReset, loading, error, clearError } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await authService.requestPasswordReset(email);
      setMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다. 이메일을 확인해주세요.')
      setEmail('') // 폼 초기화
    } catch (error) {
      console.error('비밀번호 재설정 요청 실패:', error)
      const errorMessage = error.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">이메일:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="가입시 사용한 이메일을 입력하세요"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem'
            }}
          />
        </div>
        
        {error && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}
        
        {successMessage && (
          <p style={{ color: 'green', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {successMessage}
          </p>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !email.trim()}
          style={{ 
            width: '100%', 
            padding: '0.75rem',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '발송 중...' : '비밀번호 재설정 링크 발송'}
        </button>
      </form>
    </div>
  )
}

export default PasswordResetRequestForm
//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     try {
//       await requestPasswordReset(email).unwrap()
//       setSuccessMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다.')
//       setEmail('')
//     } catch (err) {
//       // 에러는 Redux에서 처리됨
//       console.error('비밀번호 재설정 요청 실패:', err)
//     }
//   }
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault()
//   //   setLoading(true)
//   //   setMessage('')
    
//   //   try {
//   //     const result = await authService.requestPasswordReset(email)
//   //     setMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다. 이메일을 확인해주세요.')
//   //     setEmail('') // 폼 초기화
//   //   } catch (error) {
//   //     console.error('비밀번호 재설정 요청 실패:', error)
//   //     const errorMessage = error.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.'
//   //     setMessage(errorMessage)
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value)
//     if (error) clearError()
//     if (successMessage) setSuccessMessage('')
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="email">이메일:</label>
//         <input
//           id="email"
//           type="email"
//           value={email}
//           // onChange={(e) => setEmail(e.target.value)}
//           onChange={handleEmailChange}
//           required
//           placeholder="가입시 사용한 이메일을 입력하세요"
//           disabled={loading}
//         />
//       </div>
//       <button type="submit" disabled={loading || !email.trim()}>
//         {loading ? '발송 중...' : '비밀번호 재설정 링크 발송'}
//       </button>
//       {error && (
//         <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
//       )}
//       {successMessage && (
//         <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>
//       )}
//       {/* {message && (
//         <p style={{ 
//           color: message.includes('발송되었습니다') ? 'green' : 'red',
//           marginTop: '10px'
//         }}>
//           {message}
//         </p>
//       )} */}
//     </form>
//   )
// }

// export default PasswordResetRequestForm