import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { checkLogin } from '../utils/auth';
import { login } from '../features/auth/authSlice';

const OAuth2Redirect = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(()=> {
        const params = new URLSearchParams(location.search)
        const accessToken = params.get('accessToken')

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            checkLogin().then(user => {
                dispatch(login(user))
                navigate('/')
            })
        } else {
            alert('로그인 실패: accessToken 없음')
            navigate("/login")
        }
    }, [])
    return (
        <div>
            <h2>로그인 처리중 입니다...</h2>
        </div>
    )
}

export default OAuth2Redirect