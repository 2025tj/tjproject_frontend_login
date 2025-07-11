import React from 'react'
import LoginButton from '../components/LoginButton'
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'

const LoginPage = () => {
  return (
    <div>
      <h2>소셜 로그인</h2>
      <LoginButton />
      <hr />
      <h2>일반 로그인</h2>
      <LoginForm />
      <h2>일반 회원가입</h2>
      <SignupForm />
    </div>
  )
}

export default LoginPage
