import { useState } from 'react'
import AppRouter from './router/AppRouter'
import './App.css'
import GlobalModalAlert from './components/GlobalModalAlert'

function App() {

  return (
    <>
      <GlobalModalAlert />
      <AppRouter />
    </>
  )
}

export default App
