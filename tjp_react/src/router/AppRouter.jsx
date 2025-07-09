import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import LoginPage from '../pages/LoginPage'
import OAuth2Redirect from '../pages/OAuth2Redirect'

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        </Routes>
    </BrowserRouter>
)

export default AppRouter