import React from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '@features/auth/components/LoginForm'
import OAuth2LoginButton from '@features/auth/components/OAuth2LoginButton'

const LoginPage = () => {
  const navigate = useNavigate()
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '2rem auto', 
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '2rem' }}>로그인</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>소셜 로그인</h2>
        <OAuth2LoginButton />
      </div>
      
      <hr style={{ margin: '2rem 0' }} />
      
      <LoginForm />

      {/* 비밀번호 찾기 링크 */}
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <button 
          onClick={() => navigate('/auth/password-reset-request')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'blue', 
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          비밀번호를 잊으셨나요?
        </button>
      </div>

      {/* 회원가입 링크 */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: '#666' }}>
          아직 계정이 없으신가요?{' '}
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#28a745',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            회원가입하기
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage