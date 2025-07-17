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
                <Route path="/mypage" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <MyPage />
                    </PrivateRoute>
                } />
                <Route path="/login" element={
                    !isAuthenticated 
                        ? <LoginPage />
                        : <Navigate to="/" replace />} />
                {/* <Route path="/oauth2/redirect" element={<OAuth2Redirect />} /> */}
                <Route path="/oauth2/login" element={<OAuth2Redirect />} />
                <Route path="/email/verify" element={<EmailVerify />} />
                <Route path="/oauth2/link-complete/" element={<OAuth2LinkComplete />} />
                {/* <Route path="/oauth2/signup/:provider" element={<OAuth2SignupRedirect />} /> */}
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </BrowserRouter>
    )


}

export default AppRouter