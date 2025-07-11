import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import api from '../utils/axios'
import { login } from '../features/auth/authSlice'
import { checkLogin } from '../utils/auth'

const LoginForm = () => {
    const [form, setForm]=useState({email: '', password: ''})
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value} =e.target
        setForm(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async(e)=> {
        e.preventDefault()
        try {
            const res = await api.post('/auth/login/local', form)
            console.log("응답:",res.data)
            const {accessToken} = res.data
            if (!accessToken) {
                setError("토큰이 응답에 없음")
                return
            }
            localStorage.setItem('accessToken', accessToken)
            console.log("localStorage저장됨:", localStorage.getItem("accessToken"))

            // 사용자 정보 확인 후 redux 저장
            const user = await checkLogin()
            dispatch(login(user))
            navigate('/')
        } catch(err) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        }
    }
  return (
    <>
      <form onSubmit={handleSubmit}>
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
        <button type ="submit">로그인</button>
      </form>
    </>
  )
}

export default LoginForm
