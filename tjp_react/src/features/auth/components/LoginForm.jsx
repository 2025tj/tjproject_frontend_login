import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import {api} from '@shared/utils/api'
import { setWarning, clearWarning, login } from '../store/authSlice'
// 헤더 전용 저장 함수만 import
import { saveAccessFromHeaders, checkLogin } from '../utils/tokenUtils'

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    setError('')

    try {
      // 로그인 요청 -> 헤더로만 토큰 반환
      const res = await api.post('/auth/login', form)
      // 헤더에서 AccessToken 꺼내 저장
      saveAccessFromHeaders(res.headers)

      // 사용자 정보 가져와 로그인 처리
      const user = await checkLogin()
      if (!user) {
        setError("사용자 정보를 불러오지 못했습니다.")
        return
      }

      // warning 메시지 있으면 Redux에 저장
      if (res.data.warning) {
        dispatch(setWarning(res.data.warning))
      } else {
        dispatch(clearWarning())
      }

      dispatch(login(user))
      navigate('/')

    } catch (err) {
      console.error("로그인 실패: ", err)
      if (err.response?.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      } else {
        setError('서버 오류. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
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
      {error && <p style={{color:'red'}}>{error}</p>}
      <button type="submit"disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

export default LoginForm
