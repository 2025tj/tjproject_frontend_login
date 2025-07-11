import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
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
        const error = params.get('error')
        const email = params.get('email'); // url에 명시된 경우
        const provider = params.get('provider'); //"google" 등

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            checkLogin().then(user => {
                dispatch(login(user))
                navigate('/')
            }).catch(() => {
                alert('유저정보 로딩실패')
                navigate('/login')
            })
        } else if (error) {
            console.warn("Oauth2 로그인 에러:", error)

            // 이메일 파싱 백업: error메세지 안에 포함된 경우 추출
            const fallbackEmail = error.match(/\[email=(.*?)\]/)?.[1] || email

            // 연동 메세지 포함 시
            if (error.includes("일반 회원으로 가입된 이메일")) {
                const shouldLink = (window.confirm("이미 일반 회원으로 가입된 이메일입니다.\n 소셜 계정과 연동하시겠습니까?"))
                if (shouldLink) {
                    // 연동 요청
                    fetch("/users/link-social", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }, 
                        body: JSON.stringify({
                            email: fallbackEmail,
                            provider: provider
                        })
                    })
                    .then(res=> {
                        if (!res.ok) throw new Error("연동 실패");
                        alert("소셜 연동 완료! 다시 로그인해주세요.")
                        navigate("/login")
                    })
                    .catch(err=> {
                        alert("연동중 오류 발생: "+err.message)
                        navigate("/login")
                    })
                } else {
                    navigate("/login")
                }
            } else {
                alert("로그인 실패:" +error)
                navigate("/login")
            }
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