import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@features/auth/api'

const UserEditForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    nickname: '', 
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // 현재 사용자 정보 로드
    const loadUserInfo = async () => {
      try {
        const response = await authApi.getProfile()
        setForm(prev => ({ 
          ...prev, 
          nickname: response.data.nickname || ''
        }))
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error)
        setError('사용자 정보를 불러올 수 없습니다.')
      }
    }

    loadUserInfo()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // 입력 시 메시지 클리어
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!form.nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return false
    }

    if (form.password && form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return false
    }

    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const updateData = {
        nickname: form.nickname.trim()
      }
      
      // 비밀번호가 입력된 경우에만 포함
      if (form.password) {
        updateData.password = form.password
      }

      await authApi.updateProfile(updateData)
      setSuccess('정보가 성공적으로 수정되었습니다.')
      
      // 비밀번호 필드 초기화
      setForm(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }))
      
      // 2초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccess('')
      }, 2000)
      
    } catch (error) {
      console.error('정보 수정 실패:', error)
      const errorMessage = error.response?.data?.message || '정보 수정에 실패했습니다.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>개인정보 수정</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="nickname">닉네임:</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            disabled={loading}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">새 비밀번호 (선택사항):</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="변경할 경우에만 입력"
            disabled={loading}
            minLength={8}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            * 비밀번호를 변경하지 않으려면 비워두세요
          </small>
        </div>

        {form.password && (
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword">비밀번호 확인:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={loading}
              required={!!form.password}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        )}

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: 'green', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {success}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="submit"
            disabled={loading || !form.nickname.trim()}
            style={{ 
              flex: 1,
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '수정 중...' : '정보 수정'}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/mypage')}
            disabled={loading}
            style={{ 
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserEditForm

// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router'
// import {api} from '@shared/utils/api'

// const UserEditform = () => {
//     const navigate = useNavigate()
//     const [form, setForm] = useState({ nickname: '', password: '' })

//     useEffect(() => {
//         api.get('/users/me').then(res => {
//         setForm(prev => ({ ...prev, ...res.data }))
//         })
//     }, [])

//     const handleChange = e => {
//         const { name, value } = e.target
//         setForm(prev => ({ ...prev, [name]: value }))
//     }

//     const handleSubmit = () => {
//         api.put('/users/me', form)
//             .then(() => {
//                 alert('수정 완료')
//                 navigate('/')
//             })
//             .catch(() => alert('수정 실패'))
//     }

//   return (
//     <div>
//         <input
//             name="nickname"
//             value={form.nickname}
//             onChange={handleChange}
//             placeholder="닉네임"
//         />
//         <input
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="새 비밀번호"
//             type="password"
//         />
//         <button onClick={handleSubmit}>정보 수정</button>
//     </div>
//   )
// }

// export default UserEditform
