import { useEffect, useState } from 'react'
import AppRouter from './router/AppRouter'
import './App.css'
import GlobalModalAlert from './components/GlobalModalAlert'
import Header from './components/Header'
import { useDispatch } from 'react-redux'
import { login, logout } from './features/auth/authSlice'
import api from './utils/axios'

function App() {
  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    api.get('/auth/me', { withCredentials: true })
      .then(({ data }) => dispatch(login(data)))
      .catch(() => dispatch(logout()))
      .finally(() => setIsLoginChecked(true));
  }, [dispatch])

  if (!isLoginChecked) {
    return <div>로딩중...</div>;
  }


  return (
    <>
      <GlobalModalAlert />
      <AppRouter />
    </>
  )
}

export default App
