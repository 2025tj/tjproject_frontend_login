import { useEffect, useState } from "react"
import { useNavigate} from 'react-router-dom'
import api from '../utils/axios'

const Home = () => {
    const [email, setEmail] = useState('')
    const navigate =useNavigate()
    const [isLoading, setIsLoading] =useState(true)

    useEffect(()=> {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            navigate('/login')
            return
        }

        // 사용자 정보 요청
        api.get('/users/me')
            .then((res) => setEmail(res.data.email))
            .catch((err) => {
                console.error('유저 정보 가져오기 실패: ', err)
                localStorage.removeItem('accessToken') // refreshToken이 만료되었을수도 있으므로
                if (window.location.pathname !== '/login') {
                    navigate('/login')
                }
                
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const handleLogout = () => {
        // accessToken 제거
        localStorage.removeItem('accessToken') // accessToken제거
        // document.cookie = "accessToken=; Max-Age=0; path=/"
        api.post('/users/logout') // 서버에서 쿠키 삭제
            .then(() => {
                localStorage.removeItem('accessToken') // accessToken제거
            })
            .finally(() => {
                setTimeout(()=> {
                    window.location.href= '/login'
            }, 300)
        })
                
    }

    if (isLoading) return <div>로딩중...</div>

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