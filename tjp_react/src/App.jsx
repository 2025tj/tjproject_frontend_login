import { useEffect } from 'react'
import AppRouter from '@app/router/AppRouter'
import './App.css'
import {GlobalAlert} from '@shared/components/layout'
import { useDispatch, useSelector } from 'react-redux'
import { logoutThunk, restoreUserThunk } from './features/auth/store/authThunk'
import { useAuthInit } from './features/auth/hooks/useAuthInit'
import Loading from './features/auth/components/Loading'
import { setAuthErrorHandler } from './shared/utils/api/client'
import { useNavigate } from 'react-router'



function App() {

  useAuthInit()
  // const { loading } = useSelector(state => state.auth)

  // 콜백 등록 (1회)
  // useEffect(() => {
  //   setAuthErrorHandler(() => {
  //     dispatch(logoutThunk())
  //     navigate('/login')
  //   })
  // }, [dispatch, navigate])

  // if (loading) {
  //   return <Loading />
  // }

  return (
    <>
      <GlobalAlert />
      <AppRouter />
    </>
  )
}

export default App
