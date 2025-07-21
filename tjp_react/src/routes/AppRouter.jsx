import { BrowserRouter, Routes, Route ,Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import LoginPage from '../pages/LoginPage'
import OAuth2Redirect from '../pages/OAuth2Redirect'
import { useEffect, useState } from 'react'
import { checkLogin } from '../utils/authUtils'
import PrivateRoute from './PrivateRoute'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../features/auth/authSlice'
import MyPage from '../pages/MyPage'
import EmailVerify from '../pages/EmailVerify'
import Header from '../components/Header'
import SignupPage from '../pages/SignupPage'
import SocialLinkPage from '../pages/SocialLinkPage'
import OAuth2LinkRedirect from '../pages/OAuth2LinkRedirect'
import OAuth2SignupRedirect from '../pages/OAuth2SignupRedirect'
import OAuth2LinkComplete from '../components/OAuth2LinkComplete'
import PasswordResetRequestPage from '../pages/auth/PasswordResetRequestPage'
import PasswordResetPage from '../pages/auth/PasswordResetPage'

const AppRouter = (isLoginChecked) => {
    const [loading, setLoading] = useState(true)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()

    // useEffect(()=> {
    //     // const checkAuth = async () => {
    //     //     const userData = await checkLogin()
    //     //     if (userData) {
    //     //         dispatch(login(userData))
    //     //     } else {
    //     //         dispatch(logout())
    //     //     }
    //     //     setLoading(false)
    //     // }

    //     if (!localStorage.getItem('accessToken')) {
    //             dispatch(logout())
    //             setLoading(false)
    //     } else {
    //         // checkAuth()
    //     }

    // }, [dispatch])

    // if (loading) return <div>로딩중...</div>
    if (!isLoginChecked) return <div>로딩중...</div>

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                
                {/* 마이페이지 - 인증 필요 */}
                <Route path="/mypage" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <MyPage />
                    </PrivateRoute>
                } />
                
                {/* 로그인 - 이미 로그인된 경우 홈으로 리다이렉트 */}
                <Route path="/login" element={
                    !isAuthenticated 
                        ? <LoginPage />
                        : <Navigate to="/" replace />
                } />
                
                {/* 회원가입 */}
                <Route path="/signup" element={<SignupPage />} />
                
                {/* OAuth2 관련 */}
                <Route path="/oauth2/login" element={<OAuth2Redirect />} />
                <Route path="/oauth2/link-complete" element={<OAuth2LinkComplete />} />
                
                {/* 이메일 인증 */}
                <Route path="/email/verify" element={<EmailVerify />} />
                
                {/* 🆕 비밀번호 재설정 관련 */}
                <Route path="/auth/password-reset-request" element={
                    !isAuthenticated 
                        ? <PasswordResetRequestPage />
                        : <Navigate to="/" replace />
                } />
                <Route path="/auth/password-reset" element={
                    !isAuthenticated 
                        ? <PasswordResetPage />
                        : <Navigate to="/" replace />
                } />
                
                {/* 기타 리다이렉트나 404 처리 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )


}

export default AppRouter