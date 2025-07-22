import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'
import { authApi } from '@features/auth/api'
import { extractAccessToken } from '@features/auth/utils'
import SignupForm from '@features/auth/components/SignupForm'

const OAuth2SignupRedirect = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [signupData, setSignupData] = useState(null)
  const [error, setError] = useState({})
  const { login } = useAuth()

  useEffect(() => {
    const fetchPendingSignup = async () => {
      try {
        const response = await authApi.getPendingSocialSignup()
        setSignupData({
          email: response.data.email,
          provider: response.data.provider
        })
      } catch (err) {
        console.error('회원가입 정보 조회 실패:', err)
        if (err.response?.status === 409) {
          setError({ _global: '이미 가입된 이메일입니다.' })
        } else {
          setError({ _global: '회원가입 정보를 불러올 수 없습니다.' })
        }
        setTimeout(() => navigate('/login'), 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingSignup()
  }, [navigate])

  const handleSignupSubmit = async (formData) => {
    setLoading(true)
    setError({})

    try {
      // OAuth2 회원가입 (provider 정보 포함)
      const signupResponse = await authApi.signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        provider: signupData.provider
      })

      // OAuth2 완료 처리
      const oauthResponse = await authApi.completeOAuth2()
      const accessToken = extractAccessToken(oauthResponse.headers)
      
      if (accessToken) {
        const userResponse = await authApi.getProfile()
        // 로그인 처리는 Redux에서
        await login({ 
          user: userResponse.data, 
          accessToken 
        })
        
        alert('회원가입과 소셜 연동이 완료되었습니다!')
        navigate('/')
      } else {
        throw new Error('인증 토큰을 받지 못했습니다.')
      }
    } catch (err) {
      console.error('OAuth2 회원가입 실패:', err)
      
      // 서버 유효성 검사 에러 처리
      if (err.response?.data && typeof err.response.data === 'object') {
        setError(err.response.data)
      } else {
        setError({ 
          _global: err.response?.data?.message || '소셜 회원가입 중 오류가 발생했습니다.' 
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading && !signupData) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '50vh'
      }}>
        회원가입 정보를 불러오는 중...
      </div>
    )
  }

  if (error._global && !signupData) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '50vh'
      }}>
        <p style={{ color: 'red' }}>{error._global}</p>
        <p>잠시 후 로그인 페이지로 이동합니다...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: 500, 
      margin: '2rem auto', 
      padding: '2rem'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        소셜 회원가입 ({signupData?.provider})
      </h2>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        color: '#666',
        fontSize: '0.9rem'
      }}>
        추가 정보를 입력하여 회원가입을 완료해주세요.
      </p>
      
      <SignupForm
        initialValues={{ email: signupData?.email || '' }}
        disableFields={['email', 'confirmPassword']}
        errors={error}
        onSubmit={handleSignupSubmit}
        submitting={loading}
      />
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1rem'
      }}>
        <button 
          onClick={() => navigate('/login')}
          disabled={loading}
          style={{ 
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default OAuth2SignupRedirect