import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { loginThunk } from '../store/authThunk'
import { clearWarning } from '../store/authSlice'

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, warning } = useSelector(state => state.auth)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    dispatch(clearWarning())

    try {
      await dispatch(loginThunk(form)).unwrap()
      navigate('/')
    } catch (err) {
      console.error('로그인 실패:', err)
      // 추가 디버깅 정보
      if (err.response) {
        console.log('에러 응답:', err.response)
        console.log('에러 응답 헤더:', err.response.headers)
        console.log('에러 응답 데이터:', err.response.data)
        console.log('에러 응답 상태:', err.response.status)
      } else if (err.request) {
        console.log('요청은 보냈지만 응답 없음:', err.request)
      } else {
        console.log('요청 설정 중 에러:', err.message)
      }
      // if (errMsg.includes('401')) {
      //   setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      // } else {
      //   setError(errMsg || '서버 오류. 잠시 후 다시 시도해주세요.')
      // }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{color:'red'}}>{error}</p>}
      {warning && <p style={{ color: 'orange' }}>{warning}</p>}
      <h2>일반 로그인</h2>
      <input
        type="email"
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
      /><br />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
      /><br />
      <button type="submit"disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

export default LoginForm
