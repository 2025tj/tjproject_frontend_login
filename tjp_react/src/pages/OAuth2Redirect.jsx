import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

const OAuth2Redirect = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // useEffect(()=> {
    //     const params = new URLSearchParams(location.search)
    //     const token = params.get('token')

    //     if (token) {
    //         localStorage.setItem("accessToken", token)
    //         navigate("/")
    //     } else {
    //         alert('로그인 실패')
    //         navigate("/login")
    //     }
    // }, [location, navigate])
    useEffect(()=> {
        navigate("/")
    }, [])

    return (
        <div>
            <h2>로그인 처리중 입니다...</h2>
        </div>
    )
}

export default OAuth2Redirect