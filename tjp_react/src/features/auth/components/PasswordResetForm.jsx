import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'

const PasswordResetForm = ({ token }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [validationError, setValidationError] = useState('')
  const { resetPassword, loading, error, clearError } = useAuth()


   const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // 입력 시 에러들 클리어
    if (error) clearError()
    if (successMessage) setSuccessMessage('')
    if (validationError) setValidationError('')
  }

  const validateForm = () => {
    // 백엔드 PasswordResetExecuteRequest의 패턴 검증과 일치
    if (formData.newPassword.length < 8 || formData.newPassword.length > 20) {
      setValidationError('비밀번호는 8자 이상 20자 이하여야 합니다.')
      return false
    }

    // 영문, 숫자, 특수문자 포함 검증
    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(formData.newPassword)) {
      setValidationError('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.')
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('비밀번호가 일치하지 않습니다.')
      return false
    }

    return true
  }

   const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await authService.resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      setSuccessMessage('비밀번호가 성공적으로 재설정되었습니다. 잠시 후 로그인 페이지로 이동합니다.')
      
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      console.error('비밀번호 재설정 실패:', err)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="newPassword">새 비밀번호:</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={8}
            placeholder="새 비밀번호 (8자 이상)"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="confirmPassword">비밀번호 확인:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            placeholder="비밀번호 다시 입력"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem'
            }}
          />
        </div>
        
        {validationError && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {validationError}
          </p>
        )}
        
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
          disabled={loading || !formData.newPassword || !formData.confirmPassword}
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
          {loading ? '재설정 중...' : '비밀번호 재설정'}
        </button>
      </form>
    </div>
  )
}

export default PasswordResetForm

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // 클라이언트 사이드 검증
//     if (formData.newPassword !== formData.confirmPassword) {
//       return // 에러는 별도 상태로 관리하거나 Redux에서 처리
//     }

//     if (formData.newPassword.length < 8) {
//       return
//     }
//     // setLoading(true)
//     // setMessage('')

//     // 클라이언트 사이드 검증
//     // if (formData.newPassword !== formData.confirmPassword) {
//     //   setMessage('비밀번호가 일치하지 않습니다.')
//     //   setLoading(false)
//     //   return
//     // }

//     // if (formData.newPassword.length < 8) {
//     //   setMessage('비밀번호는 8자 이상이어야 합니다.')
//     //   setLoading(false)
//     //   return
//     // }
    
//      try {
//       await resetPassword(token, formData.newPassword, formData.confirmPassword).unwrap()
      
//       setSuccessMessage('비밀번호가 성공적으로 재설정되었습니다. 잠시 후 로그인 페이지로 이동합니다.')
      
//       // 2초 후 로그인 페이지로 이동
//       setTimeout(() => {
//         navigate('/login')
//       }, 2000)
//     } catch (err) {
//       console.error('비밀번호 재설정 실패:', err)
//     }
//     // try {
//     //   const result = await authService.resetPassword(
//     //     token, 
//     //     formData.newPassword, 
//     //     formData.confirmPassword
//     //   )
      
//     //   setMessage('비밀번호가 성공적으로 재설정되었습니다. 잠시 후 로그인 페이지로 이동합니다.')
//     //   // 2초 후 로그인 페이지로 이동
//     //   setTimeout(() => {
//     //     navigate('/login')
//     //   }, 2000)
//     // } catch (error) {
//     //   console.error('비밀번호 재설정 실패:', error)
//     //   const errorMessage = error.response?.data?.message || '비밀번호 재설정에 실패했습니다.'
//     //   setMessage(errorMessage)
//     // } finally {
//     //   setLoading(false)
//     // }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="newPassword">새 비밀번호:</label>
//         <input
//           id="newPassword"
//           name="newPassword"
//           type="password"
//           value={formData.newPassword}
//           onChange={handleChange}
//           required
//           minLength={8}
//           placeholder="새 비밀번호 (8자 이상)"
//           disabled={loading}
//         />
//       </div>
//       <div>
//         <label htmlFor="confirmPassword">비밀번호 확인:</label>
//         <input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//           minLength={8}
//           placeholder="비밀번호 다시 입력"
//           disabled={loading}
//         />
//       </div>
//       <button 
//         type="submit" 
//         disabled={loading || !formData.newPassword || !formData.confirmPassword}
//       >
//         {loading ? '재설정 중...' : '비밀번호 재설정'}
//       </button>
//       {message && (
//         <p style={{ 
//           color: message.includes('성공적으로') ? 'green' : 'red',
//           marginTop: '10px'
//         }}>
//           {message}
//         </p>
//       )}
//     </form>
//   )
// }

// export default PasswordResetForm