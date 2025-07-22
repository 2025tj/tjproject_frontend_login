import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { login, loading, error, warning, clearError, clearWarning } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    // 입력 시 에러/경고 클리어
    if (error) clearError()
    if (warning) clearWarning()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.email.trim() || !form.password.trim()) {
      return
    }

    try {
      // 백엔드 LoginRequest record와 정확히 일치하는 형태로 전송
      const loginData = {
        email: form.email.trim(),
        password: form.password
      }
      await login(loginData).unwrap()
      navigate('/')
    } catch (err) {
      // 에러는 Redux에서 자동 처리됨
      console.error('로그인 실패:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h2>일반 로그인</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          required
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            marginBottom: '0.5rem'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          required
          style={{ 
            width: '100%', 
            padding: '0.5rem'
          }}
        />
      </div>
      
      {/* 백엔드 LoginResult의 warning 처리 */}
      {warning && (
        <p style={{ color: 'orange', marginBottom: '1rem', fontSize: '0.9rem' }}>
           {warning}
        </p>
      )}
      
      {error && (
        <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </p>
      )}
      
      <button 
        type="submit" 
        disabled={loading || !form.email.trim() || !form.password.trim()}
        style={{ 
          width: '100%', 
          padding: '0.75rem',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

export default LoginForm


// const LoginForm = () => {
//   const [form, setForm] = useState({ email: '', password: '' })
//   // const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { login, loading, error, clearError } = useAuth()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))

//     // 입력 시 에러 클리어
//     if (error) clearError()
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const loginData = {
//       email: form.email,        // 직접 문자열 할당
//       password: form.password   // 직접 문자열 할당
//     }
    
//     try {
//       await login(loginData).unwrap() // thunk의 unwrap() 사용
//       navigate('/')
//     } catch (err) {
//       // 에러는 Redux에서 자동 처리됨
//       console.error('로그인 실패:', err)
//     }
//   }

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault()
//   //   setIsLoading(true);
//   //   setError('')

//   //   try {
//   //     // 로그인 요청 -> 헤더로만 토큰 반환
//   //     const res = await api.post('/auth/login', form)
//   //     // 헤더에서 AccessToken 꺼내 저장
//   //     saveAccessFromHeaders(res.headers)

//   //     // 사용자 정보 가져와 로그인 처리
//   //     const user = await checkLogin()
//   //     if (!user) {
//   //       setError("사용자 정보를 불러오지 못했습니다.")
//   //       return
//   //     }

//   //     // warning 메시지 있으면 Redux에 저장
//   //     if (res.data.warning) {
//   //       dispatch(setWarning(res.data.warning))
//   //     } else {
//   //       dispatch(clearWarning())
//   //     }

//   //     dispatch(login(user))
//   //     navigate('/')

//   //   } catch (err) {
//   //     console.error("로그인 실패: ", err)
//   //     if (err.response?.status === 401) {
//   //       setError("이메일 또는 비밀번호가 올바르지 않습니다.")
//   //     } else {
//   //       setError('서버 오류. 잠시 후 다시 시도해주세요.')
//   //     }
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // }

//   return (
//     <form onSubmit={handleSubmit}>
//       {error && <p>{error}</p>}
//       <h2>일반 로그인</h2>
//       <input
//         type="email"
//         name="email"
//         placeholder="이메일"
//         value={form.email}
//         onChange={handleChange}
//         disabled={loading}
//       /><br />
//       <input
//         type="password"
//         name="password"
//         placeholder="비밀번호"
//         value={form.password}
//         onChange={handleChange}
//         disabled={loading}
//       /><br />
//       {error && <p style={{color:'red'}}>{error}</p>}
//       <button type="submit"disabled={loading}>
//         {isLoading ? '로그인 중...' : '로그인'}
//       </button>
//     </form>
//   )
// }

// export default LoginForm
