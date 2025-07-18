import React, { useEffect, useState } from 'react'
import api from '../utils/axios'
import { useNavigate } from 'react-router'
import UserEditform from '../components/UserEditform'
// import LinkGoogleButton from '../components/LinkGoogleButton'
import OAuth2LinkSection from '../components/OAuth2LinkSection'

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // 재발송 쿨다운 타이머
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/users/me/details');
            setUser(response.data.data);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (resendLoading || resendCooldown > 0) return;

        setResendLoading(true);
        try {
            await api.post('/email/resend-verification');
            alert('인증 메일이 재발송되었습니다. 이메일을 확인해주세요.');
            setResendCooldown(60); // 60초 쿨다운
        } catch (error) {
            const errorMessage = error.response?.data || '재발송에 실패했습니다.';
            alert(errorMessage);
        } finally {
            setResendLoading(false);
        }
    };
    if (loading) return <div>로딩중...</div>;

  return (
    <div>
        <h2>마이페이지</h2>
        {/* 이메일 인증 필요 섹션 */}
        {user &&!user.emailVerified && (
            <div>
                <h2>이메일 인증 필요</h2>
                <p>계정을 안전하게 사용하기 위해 이메일 인증을 완료해주세요.</p>
                <button onClick={handleResendVerification}
                        disabled={resendLoading || resendCooldown > 0}>
                            {resendLoading ? '발송 중...' : 
                             resendCooldown > 0 ? `재발송 (${resendCooldown}초 후)` : 
                             '인증 메일 재발송'}
                </button>
                <button onClick={fetchUserInfo}>새로고침</button>
                {resendCooldown > 0 && (
                        <p style={{ 
                            color: '#856404', 
                            fontSize: '14px', 
                            marginTop: '10px',
                            marginBottom: 0 
                        }}>
                            스팸 방지를 위해 잠시 후 다시 시도해주세요.
                        </p>
                    )}
            </div>
        )}
        {/* 이메일 인증 완료 섹션 */}
        {user && user.emailVerified && (
            <div>
                <div>
                    <h2>계정 정보</h2>
                    <p>이메일: {user.email}</p>
                    <p>닉네임: {user.nickname || '설정되지 않음'}</p>
                    <p>역할: {user.roles?.join(', ')}</p>
                    <p>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</p>
                    <p>이메일 인증: 완료</p>
                </div>

                {/* OAuth2 연동 섹션 */}
                <OAuth2LinkSection />
            </div>
        )}

        {/* <LinkGoogleButton /> */}
        {/* 사용자 정보 수정 폼 */}
        <UserEditform />
    </div>
  )
}

export default MyPage
