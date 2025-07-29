import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchUserProfileThunk, updateUserInfoThunk } from '../store/userThunk'

const UserEditform = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.profile)
    const loading = useSelector(state => state.user.loading)
    const [form, setForm] = useState({ nickname: '', password: '' })

    useEffect(() => {
        // 이미 전역 상태에 유저가 있다면 초기값 설정
        if (user) {
            setForm(prev => ({
                ...prev,
                nickname: user.nickname || '',
            }))
        } else {
            dispatch(fetchUserProfileThunk())
        }
    }, [user, dispatch])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
    dispatch(updateUserInfoThunk(form))
      .unwrap()
      .then(() => {
        alert('수정 완료')
        navigate('/')
      })
      .catch(() => alert('수정 실패'))
  }

  if (!user) return null // 또는 <div>로딩 중...</div>

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>개인정보 수정</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="nickname">닉네임:</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            disabled={loading}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">새 비밀번호 (선택사항):</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="새 비밀번호"
            type="password"
        />
        <button onClick={handleSubmit} disabled={loading}>
            {loading ? '수정 중...' : '정보 수정'}
        </button>
    </div>
  )
}

export default UserEditForm

// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router'
// import {api} from '@shared/utils/api'

// const UserEditform = () => {
//     const navigate = useNavigate()
//     const [form, setForm] = useState({ nickname: '', password: '' })

//     useEffect(() => {
//         api.get('/users/me').then(res => {
//         setForm(prev => ({ ...prev, ...res.data }))
//         })
//     }, [])

//     const handleChange = e => {
//         const { name, value } = e.target
//         setForm(prev => ({ ...prev, [name]: value }))
//     }

//     const handleSubmit = () => {
//         api.put('/users/me', form)
//             .then(() => {
//                 alert('수정 완료')
//                 navigate('/')
//             })
//             .catch(() => alert('수정 실패'))
//     }

//   return (
//     <div>
//         <input
//             name="nickname"
//             value={form.nickname}
//             onChange={handleChange}
//             placeholder="닉네임"
//         />
//         <input
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="새 비밀번호"
//             type="password"
//         />
//         <button onClick={handleSubmit}>정보 수정</button>
//     </div>
//   )
// }

// export default UserEditform
