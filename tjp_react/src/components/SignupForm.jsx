import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../utils/axios'

const SignupForm = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        nickname: ''
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value  } = e.target
        setForm(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await api.post('/auth/signup/local', form)
            alert('회원 가입 성공! 로그인 페이지로 이동합니다.')
            navigate('/login')
        } catch (err) {
            if (err.response?.status === 400) {
                setErrors(err.response.data) // 유효성 검사 실패
            } else if (err.response?.status === 409) {
                setErrors({email: '이미 사용중인 이메일 입니다.'})
            } else {
                alert('예상치 못한 오류가 발생했습니다.')
            }
        }
    }
  return (
    <>
      <form onSubmit={handleSubmit} style= {{maxWidth: 400}}>
        <div>
            <label>이메일</label><br />
            <input type="email" name="email" value={form.email} onChange={handleChange} />
            {errors.email && <p style={{color:'red'}}>{errors.email}</p>} 
        </div>
        <div>
            <label>비밀번호</label><br />
            <input type="password" name="password" value={form.password} onChange={handleChange} />
            {errors.password && <p style={{color:'red'}}>{errors.password}</p>} 
        </div>
        <div>
            <label>닉네임</label><br />
            <input type="text" name="nickname" value={form.nickname} onChange={handleChange} />
            {errors.nickname && <p style={{color:'red'}}>{errors.nickname}</p>} 
        </div>
        <button type="submit" style={{marginTop:'1rem'}}>회원가입</button>
      </form>
    </>
  )
}

export default SignupForm
