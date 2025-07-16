import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import './App.css'
import GlobalModalAlert from './components/GlobalModalAlert'
import Header from './components/Header'
import { useDispatch } from 'react-redux'
import { login, logout } from './features/auth/authSlice'
import api from './utils/axios'

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => dispatch(login(data)))
      .catch(() => dispatch(logout()))
  }, [dispatch])

  return (
    <>
      <GlobalModalAlert />
      <AppRouter />
    </>
  )
}

export default App
