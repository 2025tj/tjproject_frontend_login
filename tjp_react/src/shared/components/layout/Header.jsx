import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { logoutThunk } from '../../../features/auth/store/authThunk'

const Header = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout, loading, getUserDisplayName } = useAuth()

    const handleLogout = async () => {
        try {
            await dispatch(logoutThunk()).unwrap()
            navigate('/login')
        } catch (err) {
            console.error('로그아웃 요청 실패:', err)
        }
    }

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #ddd',
      backgroundColor: 'white'
    }}>
      <div>
        <h2 style={{ margin: 0 }}>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: '#333',
              fontSize: '1.5rem'
            }}
          >
            🏠 홈
          </Link>
        </h2>
      </div>
      
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem'
      }}>
        {isAuthenticated ? (
          <>
            <span style={{ 
              fontSize: '0.9rem', 
              color: '#666'
            }}>
              안녕하세요, {getUserDisplayName()}님!
            </span>
            
            <Link 
              to="/mypage"
              style={{
                textDecoration: 'none',
                color: '#007bff',
                padding: '0.5rem 1rem',
                border: '1px solid #007bff',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
            >
              마이페이지
            </Link>
            
            <button 
              onClick={handleLogout} 
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: loading ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? '로그아웃 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <Link 
            to="/login"
            style={{
              textDecoration: 'none',
              color: 'white',
              backgroundColor: '#007bff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
          >
            로그인
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header

// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link, useNavigate } from 'react-router'
// import {api} from '../../utils/api'
// import { logout } from '../../../features/auth/store/authSlice'
// import { removeUserInfo } from '../../../features/auth/utils'
// import { useAuth } from '../../../features/auth/hooks/useAuth'

// const Header = () => {
//     // const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const { isAuthenticated, logout, loading } = useAuth()

//     const handleLogout = async () => {
//         try {
//             await logout().unwrap()
//             navigate('/login')
//         } catch (err) {
//             // 에러가 발생해도 로그아웃 처리는 됨
//             console.error('로그아웃 중 오류:', err)
//             navigate('/login')
//         }
//     }

//     // const handleLogout = async () => {
//     //     try {
//     //         await api.post('/auth/logout', null, {
//     //             withCredentials: true, // 쿠키 삭제 요청
//     //         })
//     //     } catch (err) {
//     //         console.error('로그아웃 요청 실패:', err)
//     //     } finally {
//     //         // localStorage.removeItem('accessToken')  // accessToken제거
//     //         removeUserInfo()
//     //         navigate('/login')
//     //     }
//     // }

//     return (
//         <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
//             <h2><Link to="/">홈으로가기</Link></h2>
//             <nav>
//                 {isAuthenticated ? (
//                     <>
//                         <Link to="/mypage">마이페이지</Link>
//                         <button onClick={handleLogout} disabled={loading}>
//                             {loading ? '로그아웃 중...' : '로그아웃'}
//                         </button>
//                         {/* <button onClick={handleLogout}>로그아웃</button> */}
//                     </>
                    
//                 ) : (
//                     <Link to="/login">로그인</Link>
//                 )}
//             </nav>
//         </header>
//     )
// }

// export default Header
