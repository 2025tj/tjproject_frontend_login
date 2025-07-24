import { BrowserRouter, Routes, Route ,Navigate} from 'react-router-dom'
import Home from '../../features/dashboard/HomePage'
import LoginPage from '../../features/auth/pages/LoginPage'
import OAuth2Redirect from '../../features/auth/pages/OAuth2Redirect'
import PrivateRoute from './PrivateRoute'
import { useDispatch, useSelector } from 'react-redux'
import MyPage from '../../features/user/pages/MyPage'
import EmailVerify from '../../features/email/pages/EmailVerify'
import Header from '../../shared/components/layout/Header'
import SignupPage from '../../features/auth/pages/SignupPage'
// import SocialLinkPage from '@features/auth/pages/SocialLinkPage'
// import OAuth2LinkRedirect from '../../features/auth/pages/OAuth2LinkRedirect'
// import OAuth2SignupRedirect from '../../features/auth/pages/OAuth2SignupRedirect'
import OAuth2LinkComplete from '../../features/auth/components/OAuth2LinkComplete'
import PasswordResetRequestPage from '../../features/auth/pages/PasswordResetRequestPage'
import PasswordResetPage from '../../features/auth/pages/PasswordResetPage'
import { withAuthGuard } from '../../features/auth/components/withAuthGuard'
import AuthRedirectHandler from '../../shared/utils/api/AuthRedirectHandler'

const AppRouter = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const ProtectedMyPage = withAuthGuard(MyPage)


    return (
        <BrowserRouter>
            <AuthRedirectHandler />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                
                {/* 마이페이지 - 인증 필요 */}
                <Route path="/mypage" element={<ProtectedMyPage />} />
                
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