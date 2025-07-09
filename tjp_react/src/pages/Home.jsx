import { useEffect, useState } from "react"
import { useNavigate} from 'react-router-dom'
import api from '../utils/axios'

const Home = () => {
    const [email, setEmail] = useState('')
    const navigate =useNavigate()

    useEffect(()=> {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            navigate('/login')
            return
        }

        // 사용자 정보 요청
        api.get('/users/me')
            .then((res) => setEmail(res.data))
            .catch((err) => {
                console.error(err)
                alert('인증실패, 다시 로그인하세요')
                localStorage.removeItem('accessToken')
                navigate('/login')
            })
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        window.location.href= '/login'
    }

    return (
        <div style={{ padding: '2rem'}}>
            <h1>홈 화면입니다</h1>
            <p>로그인에 성공했습니다</p>
            <p>로그인된 사용자: {email}</p>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default Home