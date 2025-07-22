import { useEffect, useState } from 'react'
import AppRouter from '@app/router/AppRouter'
import './App.css'
import {GlobalAlert} from '@shared/components/layout'
import {Header} from '@shared/components/layout'
import { useDispatch } from 'react-redux'
import { login, logout, setAccessToken } from '@features/auth/store/authSlice'
import {api} from '@shared/utils/api'
import { refreshApi } from '@shared/utils/api/client'
// import { clearAccessToken, setAccessToken } from './utils/tokenStorage'
import { extractAccessToken, getAccessToken, removeAccessToken, removeUserInfo, saveAccessFromHeaders, saveUserInfo } from '@features/auth/utils'
import { useAuth } from './features/auth/hooks/useAuth'


function App() {
  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const dispatch = useDispatch()
  const { refreshToken, loading: authLoading } = useAuth()

  useEffect(() => {
    // 앱 시작 시 토큰 갱신 시도
    refreshToken()
  }, [refreshToken])

  if (authLoading) {
    return <div>로딩중...</div>;
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
