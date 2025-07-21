import { useEffect, useState } from 'react'
import AppRouter from './routes/AppRouter'
import './App.css'
import GlobalModalAlert from './components/GlobalModalAlert'
import Header from './components/Header'
import { useDispatch } from 'react-redux'
import { login, logout, setAccessToken } from './features/auth/authSlice'
import api, { refreshApi } from './utils/axios'
// import { clearAccessToken, setAccessToken } from './utils/tokenStorage'
import { extractAccessToken, getAccessToken, removeAccessToken, removeUserInfo, saveAccessFromHeaders, saveUserInfo } from './utils/authUtils'


function App() {
  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const dispatch = useDispatch()

  useEffect(()=>{
    const init = async () => {
      // const token = getAccessToken()
      // if (!token) {
      //   setIsLoginChecked(true)
      //   return
      // }

      // 쿠키에 refresh token이 있는지 체크
    // const hasRefreshToken = document.cookie.includes('refreshToken') // 쿠키명에 맞게 수정
    
    // if (!hasRefreshToken) {
    //   setIsLoginChecked(true)
    //   return
    // }
      try {
        const res = await refreshApi.post('/refresh', null, {withCredentials: true})
        saveAccessFromHeaders(res.headers)

        const userRes = await api.get('/users/me/details')
        saveUserInfo(userRes.data)
      } catch (err) {
        removeUserInfo()
        removeAccessToken()
      } finally {
        setIsLoginChecked(true)
      }
    }

    init()
  }, [dispatch])

  if (!isLoginChecked) {
    return <div>로딩중...</div>;
  }


  //   const fetchAccessToken = async() => {
  //     try {
  //       const res= await refreshApi.post('/refresh') // 쿠키 자동 전송
  //       const token = extractAccessToken(res.headers)
  //       if (token) dispatch(setAccessToken(token))
  //     } catch {
  //       dispatch(clearAccessToken())
  //     }
  //   }
  //   fetchAccessToken()
  // }, [dispatch])

  // useEffect(() => {
  //   api.get('/auth/me', { withCredentials: true })
  //     .then(({ data }) => dispatch(login(data)))
  //     .catch(() => dispatch(logout()))
  //     .finally(() => setIsLoginChecked(true));
  // }, [dispatch])

  // if (!isLoginChecked) {
  //   return <div>로딩중...</div>;
  // }


  return (
    <>
      <GlobalModalAlert />
      <AppRouter />
    </>
  )
}

export default App
