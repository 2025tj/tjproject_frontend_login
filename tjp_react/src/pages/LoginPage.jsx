import React from 'react'
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router'
import OAuth2LoginButton from '../components/OAuth2LoginButton'

const LoginPage = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h2>소셜 로그인</h2>
      <OAuth2LoginButton />
      <hr />
      <LoginForm />
      <button onClick={() => navigate('/signup')}>
        회원가입 페이지로 이동
      </button>
    </div>
  )
}

export default LoginPage
