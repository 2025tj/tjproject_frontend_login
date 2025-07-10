import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

const OAuth2Redirect = () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(()=> {
        const params = new URLSearchParams(location.search)
        const accessToken = params.get('accessToken')

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            navigate("/")
        } else {
            alert('로그인 실패: accessToken 없음')
            navigate("/login")
        }
    }, [])
    // useEffect(()=> {
    //     navigate("/")
    // }, [])

    return (
        <div>
            <h2>로그인 처리중 입니다...</h2>
        </div>
    )
}

export default OAuth2Redirect