import { useEffect } from 'react'
import AppRouter from '@app/router/AppRouter'
import './App.css'
import { GlobalAlert } from '@shared/components/layout'
import { useAuth } from '@features/auth/hooks/useAuth'

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.2rem'
  }}>
    앱을 초기화하는 중...
  </div>
)

function App() {
  const { initialize, initialized, loading } = useAuth()

   useEffect(() => {
    // 앱 시작시 인증 상태 초기화
    initialize()
  }, [initialize])

  // 초기화가 완료되지 않았으면 로딩 표시
  if (!initialized || loading) {
    return <LoadingSpinner />
  }

  // useEffect(()=>{
  //   const init = async () => {
  //     try {
  //       const res = await refreshApi.post('/refresh', null, {withCredentials: true})
  //       saveAccessFromHeaders(res.headers)

  //       const userRes = await api.get('/users/me/details')
  //       saveUserInfo(userRes.data)
  //     } catch (err) {
  //       removeUserInfo()
  //       removeAccessToken()
  //     } finally {
  //       setIsLoginChecked(true)
  //     }
  //   }

  //   init()
  // }, [dispatch])

  // if (!isLoginChecked) {
  //   return <div>로딩중...</div>;
  // }

  return (
    <>
      <GlobalAlert />
      <AppRouter />
    </>
  )
}

export default App
