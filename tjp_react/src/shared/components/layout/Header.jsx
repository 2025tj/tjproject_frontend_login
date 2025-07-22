import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import {api} from '../../utils/api'
import { logout } from '../../../features/auth/store/authSlice'
import { removeUserInfo } from '../../../features/auth/utils'
import { useAuth } from '../../../features/auth/hooks/useAuth'

const Header = () => {
    // const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, logout, loading } = useAuth()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            navigate('/login')
        } catch (err) {
            // 에러가 발생해도 로그아웃 처리는 됨
            console.error('로그아웃 중 오류:', err)
            navigate('/login')
        }
    }

    // const handleLogout = async () => {
    //     try {
    //         await api.post('/auth/logout', null, {
    //             withCredentials: true, // 쿠키 삭제 요청
    //         })
    //     } catch (err) {
    //         console.error('로그아웃 요청 실패:', err)
    //     } finally {
    //         // localStorage.removeItem('accessToken')  // accessToken제거
    //         removeUserInfo()
    //         navigate('/login')
    //     }
    // }

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
            <h2><Link to="/">홈으로가기</Link></h2>
            <nav>
                {isAuthenticated ? (
                    <>
                        <Link to="/mypage">마이페이지</Link>
                        <button onClick={handleLogout} disabled={loading}>
                            {loading ? '로그아웃 중...' : '로그아웃'}
                        </button>
                        {/* <button onClick={handleLogout}>로그아웃</button> */}
                    </>
                    
                ) : (
                    <Link to="/login">로그인</Link>
                )}
            </nav>
        </header>
    )
}

export default Header
