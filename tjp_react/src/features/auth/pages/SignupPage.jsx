import React from 'react'
import { useNavigate } from 'react-router-dom'
import SignupForm from '@features/auth/components/SignupForm'


const SignupPage = () => {
  const navigate = useNavigate()
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '2rem auto', 
      padding: '2rem'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>회원가입</h1>
      
      <SignupForm />
      
      {/* 로그인 링크 */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: '#666' }}>
          이미 계정이 있으신가요?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            로그인하기
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignupPage