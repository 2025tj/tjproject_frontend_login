import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'
import { authApi } from '@features/auth/api'
import UserEditForm from '@features/user/components/UserEditForm'
import OAuth2LinkSection from '@features/auth/components/OAuth2LinkSection'

const MyPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showEditForm, setShowEditForm] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, getUserDisplayName, isEmailVerified } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    fetchUserInfo()
  }, [isAuthenticated, navigate])

  // 재발송 쿨다운 타이머
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const fetchUserInfo = async () => {
    try {
      const response = await authApi.getProfile()
      setUser(response.data)
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error)
      if (error.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (resendLoading || resendCooldown > 0) return

    setResendLoading(true)
    try {
      await authApi.resendVerification()
      alert('인증 메일이 재발송되었습니다. 이메일을 확인해주세요.')
      setResendCooldown(60) // 60초 쿨다운
    } catch (error) {
      console.error('인증 메일 재발송 실패:', error)
      const errorMessage = error.response?.data?.message || '재발송에 실패했습니다.'
      alert(errorMessage)
    } finally {
      setResendLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        사용자 정보를 불러오는 중...
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <p>사용자 정보를 불러올 수 없습니다.</p>
        <button onClick={() => navigate('/login')}>로그인 페이지로 이동</button>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: '2rem auto', 
      padding: '0 1rem'
    }}>
      <h1>마이페이지</h1>
      
      {/* 이메일 인증 필요 섹션 */}
      {!user.emailVerified && (
        <div style={{ 
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#856404', margin: '0 0 1rem 0' }}>
            📧 이메일 인증이 필요합니다
          </h3>
          <p style={{ margin: '0 0 1rem 0' }}>
            계정을 안전하게 사용하기 위해 이메일 인증을 완료해주세요.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleResendVerification}
              disabled={resendLoading || resendCooldown > 0}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: resendLoading || resendCooldown > 0 ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: resendLoading || resendCooldown > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {resendLoading ? '발송 중...' : 
               resendCooldown > 0 ? `재발송 (${resendCooldown}초 후)` : 
               '인증 메일 재발송'}
            </button>
            <button 
              onClick={fetchUserInfo}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              상태 새로고침
            </button>
          </div>
          {resendCooldown > 0 && (
            <p style={{ 
              color: '#856404', 
              fontSize: '0.9rem', 
              marginTop: '0.5rem',
              marginBottom: 0 
            }}>
              스팸 방지를 위해 잠시 후 다시 시도해주세요.
            </p>
          )}
        </div>
      )}

      {/* 계정 정보 섹션 */}
      <div style={{ 
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: 0 }}>계정 정보</h3>
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showEditForm ? '편집 취소' : '정보 수정'}
          </button>
        </div>
        
        {showEditForm ? (
          <UserEditForm />
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div><strong>이메일:</strong> {user.email}</div>
            <div><strong>닉네임:</strong> {user.nickname || '설정되지 않음'}</div>
            <div><strong>권한:</strong> {user.roles?.join(', ') || '없음'}</div>
            <div><strong>가입일:</strong> {new Date(user.createdAt).toLocaleDateString('ko-KR')}</div>
            <div>
              <strong>이메일 인증:</strong> 
              <span style={{ 
                color: user.emailVerified ? 'green' : 'orange',
                marginLeft: '0.5rem'
              }}>
                {user.emailVerified ? '✅ 완료' : '⏳ 대기중'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 소셜 계정 연동 섹션 (이메일 인증된 경우만) */}
      {user.emailVerified && (
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <OAuth2LinkSection />
        </div>
      )}
    </div>
  )
}

export default MyPage

// import React, { useEffect, useState } from 'react'
// import {api} from '@shared/utils/api'
// import { useNavigate } from 'react-router'
// import UserEditform from '../components/UserEditform'
// // import LinkGoogleButton from '../components/LinkGoogleButton'
// import OAuth2LinkSection from '../../auth/components/OAuth2LinkSection'

// const MyPage = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [resendLoading, setResendLoading] = useState(false);
//     const [resendCooldown, setResendCooldown] = useState(0);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchUserInfo();
//     }, []);

//     // 재발송 쿨다운 타이머
//     useEffect(() => {
//         if (resendCooldown > 0) {
//             const timer = setTimeout(() => {
//                 setResendCooldown(resendCooldown - 1);
//             }, 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [resendCooldown]);

//     const fetchUserInfo = async () => {
//         try {
//             const response = await api.get('/users/me/details');
//             setUser(response.data.data);
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 navigate('/login');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResendVerification = async () => {
//         if (resendLoading || resendCooldown > 0) return;

//         setResendLoading(true);
//         try {
//             await api.post('/email/resend-verification');
//             alert('인증 메일이 재발송되었습니다. 이메일을 확인해주세요.');
//             setResendCooldown(60); // 60초 쿨다운
//         } catch (error) {
//             const errorMessage = error.response?.data || '재발송에 실패했습니다.';
//             alert(errorMessage);
//         } finally {
//             setResendLoading(false);
//         }
//     };
//     if (loading) return <div>로딩중...</div>;

//   return (
//     <div>
//         <h2>마이페이지</h2>
//         {/* 이메일 인증 필요 섹션 */}
//         {user &&!user.emailVerified && (
//             <div>
//                 <h2>이메일 인증 필요</h2>
//                 <p>계정을 안전하게 사용하기 위해 이메일 인증을 완료해주세요.</p>
//                 <button onClick={handleResendVerification}
//                         disabled={resendLoading || resendCooldown > 0}>
//                             {resendLoading ? '발송 중...' : 
//                              resendCooldown > 0 ? `재발송 (${resendCooldown}초 후)` : 
//                              '인증 메일 재발송'}
//                 </button>
//                 <button onClick={fetchUserInfo}>새로고침</button>
//                 {resendCooldown > 0 && (
//                         <p style={{ 
//                             color: '#856404', 
//                             fontSize: '14px', 
//                             marginTop: '10px',
//                             marginBottom: 0 
//                         }}>
//                             스팸 방지를 위해 잠시 후 다시 시도해주세요.
//                         </p>
//                     )}
//             </div>
//         )}
//         {/* 이메일 인증 완료 섹션 */}
//         {user && user.emailVerified && (
//             <div>
//                 <div>
//                     <h2>계정 정보</h2>
//                     <p>이메일: {user.email}</p>
//                     <p>닉네임: {user.nickname || '설정되지 않음'}</p>
//                     <p>역할: {user.roles?.join(', ')}</p>
//                     <p>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</p>
//                     <p>이메일 인증: 완료</p>
//                 </div>

//                 {/* OAuth2 연동 섹션 */}
//                 <OAuth2LinkSection />
//             </div>
//         )}

//         {/* <LinkGoogleButton /> */}
//         {/* 사용자 정보 수정 폼 */}
//         <UserEditform />
//     </div>
//   )
// }

// export default MyPage
