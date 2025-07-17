import React, { useEffect, useState } from 'react'
import api from '../utils/axios'
import { useNavigate } from 'react-router'
import UserEditform from '../components/UserEditform'
// import LinkGoogleButton from '../components/LinkGoogleButton'
import OAuth2LinkSection from '../components/OAuth2LinkSection'

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            await api.post('/auth/resend-verification');
            alert('인증 메일 재발송됨');
        } catch (error) {
            alert('재발송 실패');
        }
    };

    if (loading) return <div>로딩중...</div>;

  return (
    <div>
        <h2>마이페이지</h2>
        {!user.emailVerified && (
            <div>
                <h2>이메일 인증 필요</h2>
                <p>계정을 안전하게 사용하기 위해 이메일 인증을 완료해주세요.</p>
                <button onClick={handleResendVerification}>인증 메일 재발송</button>
                <button onClick={fetchUserInfo}>새로고침</button>
            </div>
        )}
        {user.emailVerified && (
            <div>
                <div>
                    <h2>계정 정보</h2>
                    <p>이메일: {user.email}</p>
                    <p>닉네임: {user.nickname || '설정되지 않음'}</p>
                    <p>역할: {user.roles?.join(', ')}</p>
                    <p>가입일: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p>이메일 인증: 완료</p>
                </div>

                <OAuth2LinkSection />
            </div>
        )}

        {/* <LinkGoogleButton /> */}
        <UserEditform />
    </div>
  )
}

export default MyPage
