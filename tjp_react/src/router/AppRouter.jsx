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

const AppRouter = () => {
    const [loading, setLoading] = useState(true)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()

    useEffect(()=> {
        const checkAuth = async () => {
            const userData = await checkLogin()
            if (userData) {
                dispatch(login(userData))
            } else {
                dispatch(logout())
            }
            setLoading(false)
        }

        if (!localStorage.getItem('accessToken')) {
                dispatch(logout())
                setLoading(false)
        } else {
            checkAuth()
        }

    }, [dispatch])

    if (loading) return <div>로딩중...</div>

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Home />
                    </PrivateRoute>
                } />
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
                <Route path="/oauth2/callback" element={<OAuth2Redirect />} />
            </Routes>
        </BrowserRouter>
    )


}

export default AppRouter