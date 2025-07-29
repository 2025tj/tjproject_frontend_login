import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { loginThunk } from '../store/authThunk'
import { clearWarning } from '../store/authSlice'

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, warning } = useSelector(state => state.auth)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    // 입력 시 에러/경고 클리어
    if (error) clearError()
    if (warning) clearWarning()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    dispatch(clearWarning())

    try {
      await dispatch(loginThunk(form)).unwrap()
      navigate('/')
    } catch (err) {
      console.error('로그인 실패:', err)
      // 추가 디버깅 정보
      if (err.response) {
        console.log('에러 응답:', err.response)
        console.log('에러 응답 헤더:', err.response.headers)
        console.log('에러 응답 데이터:', err.response.data)
        console.log('에러 응답 상태:', err.response.status)
      } else if (err.request) {
        console.log('요청은 보냈지만 응답 없음:', err.request)
      } else {
        console.log('요청 설정 중 에러:', err.message)
      }
      // if (errMsg.includes('401')) {
      //   setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      // } else {
      //   setError(errMsg || '서버 오류. 잠시 후 다시 시도해주세요.')
      // }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{color:'red'}}>{error}</p>}
      {warning && <p style={{ color: 'orange' }}>{warning}</p>}
      <h2>일반 로그인</h2>
      <input
        type="email"
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
      /><br />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
      /><br />
      <button type="submit"disabled={loading}>
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
