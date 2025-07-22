import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'
import { authApi } from '@features/auth/api'

const OAuth2LinkRedirect = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [linkData, setLinkData] = useState(null)
  const [password, setPassword] = useState('')
  const { linkSocialAccount } = useAuth()

  useEffect(() => {
    const fetchPendingLink = async () => {
      try {
        const response = await authApi.getPendingSocialLink()
        setLinkData(response.data)
      } catch (err) {
        console.error('연동 정보 조회 실패:', err)
        setError('연동 정보를 불러올 수 없습니다.')
        setTimeout(() => navigate('/login'), 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingLink()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await linkSocialAccount(linkData.email, password, linkData.provider).unwrap()
      alert('계정 연동이 완료되었습니다!')
      navigate('/')
    } catch (err) {
      console.error('계정 연동 실패:', err)
      setError(err || '비밀번호가 올바르지 않거나 연동 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !linkData) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '50vh'
      }}>
        연동 정보를 확인하는 중...
      </div>
    )
  }

  if (error && !linkData) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '50vh'
      }}>
        <p style={{ color: 'red' }}>{error}</p>
        <p>잠시 후 로그인 페이지로 이동합니다...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '2rem auto', 
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        🔗 소셜 계정 연동 확인
      </h2>
      
      <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <strong>{linkData?.email}</strong> 계정에<br/>
        <strong>{linkData?.provider}</strong> 소셜 로그인을 연동하려고 합니다.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">해당 계정의 비밀번호를 입력해주세요:</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              marginTop: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        {error && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="submit" 
            disabled={loading || !password.trim()}
            style={{ 
              flex: 1,
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '연동 중...' : '연동하기'}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/login')}
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

export default OAuth2LinkRedirect