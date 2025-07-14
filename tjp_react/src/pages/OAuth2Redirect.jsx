import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { checkLogin, saveAccessTokenFromCookie } from '../utils/auth';
import { login } from '../features/auth/authSlice';

const OAuth2Redirect = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const params = new URLSearchParams(location.search)
        const error = params.get('error')
        const link = params.get('link') === 'true'

        if (error) {
            alert("로그인 실패: "+error)
            navigate("/login")
            return
        }

        if (link) {
            // 연동 필요한 상태 -> 사용자 정보 요청
            fetch("/api/users/pending-social-link", {credentials: "include"})
            .then(res=> {
                if (!res.ok) throw new Error("정보 조회 실패")
                return res.json()
            })
            .then(data => {
                const {email, provider} =data
                if (!email || !provider) throw new Error("필수 정보 없음")
                const shouldLink = window.confirm(
                    "이미 가입된 이메일입니다.\n${provider} 계정과 연동하시겠습니까?"    
                )
                if (shouldLink) {
                    return fetch("/api/users/link-social", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({email, provider})
                    })
                } else {
                    navigate("/login")
                    throw new Error("사용자 취소")
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("연동 실패")
                alert("연동 완료! 다시 로그인해주세요")
                navigate("/login")
            })
            .catch(err => {
                alert("연동중 오류: "+err.message)
                navigate("/login")
            })
            .finally(() => setLoading(false))
            return
        }
        //정상로그인 : accessToken 쿠키 -> LocalStorage 저장 후 로그인 처리
        saveAccessTokenFromCookie()
        checkLogin()
        .then(user => {
            dispatch(login(user))
            navigate("/")
        })
        .catch(()=> {
            alert("유저 정보 확인 실패")
            navigate("/login")
        })
        .finally(()=> setLoading(false))
    }, [location.search, dispatch, navigate])
    return (
        <div>
            <h2>{loading ? "로그인 처리중 입니다..." : "리디렉션 완료"}</h2>
        </div>
    )
}

export default OAuth2Redirect