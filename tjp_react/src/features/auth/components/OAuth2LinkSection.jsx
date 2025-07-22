import React, { useState, useEffect } from 'react'
import { authApi } from '@features/auth/api'
import { useAuth } from '@features/auth/hooks/useAuth'

const OAuth2LinkSection = () => {
  const [linkedProviders, setLinkedProviders] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { getAccessToken } = useAuth()
  const supportedProviders = ['google', 'kakao']

  useEffect(() => {
        fetchLinkedProviders();
    }, []);

  const fetchLinkedProviders = async () => {
    try {
      const response = await authApi.getLinkedProviders()
      setLinkedProviders(response.data)
    } catch (error) {
      console.error('연동된 계정 조회 실패:', error)
    }
  }

  const handleSocialLink = (provider) => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      alert('로그인이 필요합니다.')
      return
    }

    setIsProcessing(provider)

    // 백엔드 StateInfo 구조에 맞게 수정
    // CustomOAuth2UserService에서 state 파라미터를 통해 mode와 token을 확인
    const stateData = {
      mode: 'link',
      token: accessToken,
      timestamp: Date.now()
    }
    
    // 실제로는 백엔드에서 OAuth2StateEncoder로 암호화하지만, 
    // 여기서는 단순히 query parameter로 전달
    const linkUrl = `http://localhost:8080/oauth2/authorization/${provider}?mode=link&token=${encodeURIComponent(accessToken)}`
    
    const width = 500
    const height = 600
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    const popup = window.open(
      linkUrl,
      'socialLink',
      `width=${width},height=${height},top=${top},left=${left}`
    )

    const listener = (event) => {
      // 백엔드 CustomOAuth2SuccessHandler에서 보내는 URL 확인
      if (event.origin !== 'http://localhost:5173') return

      if (event.data?.type === 'SOCIAL_LINK_SUCCESS') {
        alert(`${event.data.provider} 계정 연동 완료`)
        fetchLinkedProviders()
        setIsProcessing(false)
      } else if (event.data?.type === 'SOCIAL_LINK_FAIL') {
        alert(`연동 실패: ${event.data.reason}`)
        setIsProcessing(false)
      }

      window.removeEventListener('message', listener)
    }
    
    window.addEventListener('message', listener)

    // 팝업이 닫힐 때 처리
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        setIsProcessing(false)
        window.removeEventListener('message', listener)
        // 페이지가 닫혔으면 연동 상태 새로고침
        fetchLinkedProviders()
      }
    }, 1000)
  }

  const handleSocialUnlink = async (provider) => {
    if (!confirm(`${provider} 계정 연동을 해제하시겠습니까?`)) return

    try {
      await authApi.unlinkSocial(provider)
      alert('연동이 해제되었습니다.')
      fetchLinkedProviders()
    } catch (error) {
      console.error('연동 해제 실패:', error)
      alert('연동 해제에 실패했습니다.')
    }
  }

  return (
    <div>
      <h3>소셜 계정 연동</h3>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        소셜 계정을 연동하면 더 편리하게 로그인할 수 있습니다.
      </p>
      
      {supportedProviders.map((provider) => {
        const isLinked = linkedProviders.includes(provider)
        const isCurrentlyProcessing = isProcessing === provider
        
        return (
          <div key={provider} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>
                {provider === 'google' ? '🔍' : '💬'}
              </span>
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                {provider}
              </span>
              <span style={{ 
                color: isLinked ? 'green' : 'orange',
                fontSize: '0.9rem'
              }}>
                {isLinked ? '✅ 연동됨' : '⏳ 연동안됨'}
              </span>
            </div>
            
            {isLinked ? (
              <button 
                onClick={() => handleSocialUnlink(provider)} 
                disabled={isCurrentlyProcessing}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isCurrentlyProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                연동해제
              </button>
            ) : (
              <button 
                onClick={() => handleSocialLink(provider)} 
                disabled={isCurrentlyProcessing}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: isCurrentlyProcessing ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isCurrentlyProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isCurrentlyProcessing ? '처리중...' : '연동하기'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default OAuth2LinkSection

//     const width = 500;
//     const height = 600;
//     const left = (window.innerWidth - width) / 2;
//     const top = (window.innerHeight - height) / 2;

//     // const popup = window.open(
//     //   `http://localhost:8080/oauth2/authorization/google?redirect_uri=${encodeURIComponent('http://localhost:8080/oauth2/login/google?mode=link')}`,
//     //   'socialLink',
//     //   'width=600,height=700'
//     // );


//     const popup = window.open(
//       `http://localhost:8080/oauth2/authorization/${provider}?mode=link&token=${encodeURIComponent(accessToken)}`,
//       // `http://localhost:8080/oauth2/authorization/${provider}?state=mode=link`,
//       //  `http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:8080/oauth2/login/google?mode=link`,
//       'socialLink',
//       `width=${width},height=${height},top=${top},left=${left}`
//     )

//     const listener = (event) => {
//       if (event.origin !== 'http://localhost:5173') return

//       if (event.data?.type === 'SOCIAL_LINK_SUCCESS') {
//         // alert(`${event.data.provider} 계정 연동 완료`)
//         fetchLinkedProviders()
//       } else if (event.data?.type === 'SOCIAL_LINK_FAIL') {
//         alert(`연동 실패: ${event.data.reason}`)
//       }

//       // try {
//       //   if (popup && !popup.closed) {
//       //     popup.close()
//       //   }
//       // } catch (error) {
//       //   console.log('팝업 닫기 실패 (정상적인 보안 정책):', error)
//       // }
//       window.removeEventListener('message', listener)
//     }
//     window.addEventListener('message', listener)
//   }

//   // const handleSocialLink = (provider) => {
//   //   // 모달 대신 현재 창에서 OAuth2 페이지로 이동
//   //   // 연동 완료 후 다시 마이페이지로 돌아옴
//   //   window.location.href = `http://localhost:8080/oauth2/authorization/${provider}?mode=link`;
//   // };

//   // const handleSocialLink = (provider) => {
//   //   setIsProcessing(provider);
//   //   setModalOpen(true);
//   // };

//   // const handleLinkSuccess = (provider) => {
//   //   alert(`${provider} 계정 연동 완료!`);
//   //   fetchLinkedProviders();
//   //   setModalOpen(false);
//   //   setSelectedProvider(null);
//   // };

//   // const handleLinkError = () => {
//   //   alert('소셜 계정 연동 실패');
//   //   setModalOpen(false);
//   //   setSelectedProvider(null);
//   // };
      
//   const handleSocialUnlink = async (provider) => {
//     if (!confirm(`${provider} 계정 연동을 해제하시겠습니까?`)) return;

//     try {
//       await api.delete(`/social/unlink/${provider}`);
//       alert('연동이 해제되었습니다.');
//       fetchLinkedProviders();
//     } catch (error) {
//       alert('연동 해제 실패');
//     }
//   };
    
//   // const closeModal = () => {
//   //   setModalOpen(false);
//   //   setSelectedProvider(null);
//   // };

//   return (
//     <div>
//       <h2>소셜 계정 연동</h2>
//       {supportedProviders.map((provider) => {
//         const isLinked = linkedProviders.includes(provider);
//         return (
//           <div key={provider}>
//             <span>{provider}: {isLinked ? '연동됨' : '연동안됨'}</span>
//             {isLinked ? (
//               <button onClick={() => handleSocialUnlink(provider)} disabled={isProcessing}>
//                 연동해제
//               </button>
//             ) : (
//               <button onClick={() => handleSocialLink(provider)} disabled={isProcessing}>
//                 {isProcessing ? '처리중...' : '연동하기'}
//               </button>
//             )}
//           </div>
//         );
//       })}

//       {/* <Modal isOpen={modalOpen} onClose={closeModal}>
//         <OAuth2LinkModal
//           provider={selectedProvider}
//           onSuccess={handleLinkSuccess}
//           onError={handleLinkError}
//           onClose={closeModal}
//         />
//       </Modal> */}

//     </div>
//   )
// }

// export default OAuth2LinkSection
