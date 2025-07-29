import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh',
    fontSize: '1rem'
  }}>
    인증 확인 중...
  </div>
)

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, initialized, hasRole } = useAuth()

  // 아직 초기화되지 않았거나 로딩 중이면 로딩 표시
  if (!initialized || loading) {
    return <LoadingSpinner />
  }
  
  // 인증되지 않았으면 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // 특정 권한이 필요한 경우 권한 확인
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />
  }
  
  return children

  // // if (loading) {
  // //   // 인증 상태 확인 중일 때는 아무것도 렌더링하지 않거나 로딩 UI 표시
  // //   return null
  // // }
  // // const token = localStorage.getItem('accessToken')
  // if (!isAuthenticated) {
  //     return <Navigate to="/login" replace />
  // }
  // return children
}

export default PrivateRoute
