import React, { useEffect, useState } from 'react'
import api from '../utils/axios'
import { useNavigate } from 'react-router'

const MyPage = () => {
    const navigate= useNavigate()
    const [form, setForm] = useState({nickname: "", password: ""})
    useEffect(()=> {
        api.get("/users/me").then(res=> {
            setForm({ ...form, ...res.data})
        })
    }, [])

    const handleChange= (e) => {
        const {name,value} = e.target
        setForm(prev => ({...prev, [name]: value}))
    }
    const handleSubmit=() => {
        api.put("/users/me", form)
            .then(()=>{
                alert("수정 완료")
                navigate("/")
            })
            .catch(() => alert("수정 실패"))
    }
  return (
    <div>
        <h2>마이페이지</h2>
        <input name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임" />
        <input name="password" value={form.password} onChange={handleChange} placeholder="새 비밀번호" />
        <button onClick={handleSubmit}>정보 수정</button>
    </div>
  )
}

export default MyPage
