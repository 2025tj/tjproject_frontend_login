import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'

const PasswordResetForm = ({ token }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // 클라이언트 사이드 검증
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setMessage('비밀번호는 8자 이상이어야 합니다.')
      setLoading(false)
      return
    }
    
    try {
      await authService.resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      setMessage('비밀번호가 성공적으로 재설정되었습니다. 잠시 후 로그인 페이지로 이동합니다.')
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error)
      const errorMessage = error.response?.data?.message || '비밀번호 재설정에 실패했습니다.'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
        />
      </div>
      <div>
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
        />
      </div>
      <button 
        type="submit" 
        disabled={loading || !formData.newPassword || !formData.confirmPassword}
      >
        {loading ? '재설정 중...' : '비밀번호 재설정'}
      </button>
      {message && (
        <p style={{ 
          color: message.includes('성공적으로') ? 'green' : 'red',
          marginTop: '10px'
        }}>
          {message}
        </p>
      )}
    </form>
  )
}

export default PasswordResetForm