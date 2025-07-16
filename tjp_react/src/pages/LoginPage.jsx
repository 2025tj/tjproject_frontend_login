import React from 'react'
import LoginButton from '../components/LoginButton'
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router'

const LoginPage = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h2>소셜 로그인</h2>
      <LoginButton />
      <hr />
      <LoginForm />
      <button onClick={() => navigate('/signup')}>
        회원가입 페이지로 이동
      </button>
    </div>
  )
}

export default LoginPage
