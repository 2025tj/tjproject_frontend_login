import { useEffect, useState } from "react"
import { useNavigate} from 'react-router-dom'
import api from '../utils/axios'
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/auth/authSlice"

const Home = () => {
    const navigate =useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)

    const handleLogout = async () => {
        try {
            await api.post('/users/logout',
                {},
                {withCredentials: true}) // 쿠키 삭제 요청
        } catch(e) {
            console.error('서버 로그아웃 실패', e)
        } finally {
            localStorage.removeItem('accessToken') // accessToken제거
            dispatch(logout())
            navigate('/login', { replace: true})
        }              
    }

    return (
        <div style={{ padding: '2rem'}}>
            <h1>홈 화면입니다</h1>
            <p>로그인에 성공했습니다</p>
            <p>로그인된 사용자: {user.email}</p>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default Home