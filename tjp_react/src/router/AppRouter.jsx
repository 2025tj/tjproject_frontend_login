import { BrowserRouter, Routes, Route ,Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import LoginPage from '../pages/LoginPage'
import OAuth2Redirect from '../pages/OAuth2Redirect'
import { useEffect, useState } from 'react'
import { checkLogin } from '../utils/auth'

const AppRouter = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(()=> {
        const checkAuth = async () => {
            const user = await checkLogin()
            setIsAuthenticated(!!user)
        }
        checkAuth()
    }, [])

    if (isAuthenticated === null) return <div>로딩중...</div>

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"
                        element={isAuthenticated
                            ? <Home />
                            : <Navigate to ="/login" />} />
                <Route path="/login" 
                        element={!isAuthenticated 
                            ? <LoginPage />
                            : <Navigate to="/" />} />
                <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
            </Routes>
        </BrowserRouter>
    )


}

export default AppRouter