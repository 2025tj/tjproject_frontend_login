import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

const SignupForm = ({ 
  initialValues = {}, 
  disableFields = [], 
  errors: externalErrors = {}, 
  onSubmit: externalOnSubmit = null,
  submitting = false
}) => {
    const navigate = useNavigate()
    const { signup, loading, error, clearError } = useAuth()

    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        ...initialValues
    })

    // 외부에서 제공된 에러가 있으면 사용, 없으면 내부 에러 사용
    const displayError = externalErrors._global || error
    const isLoading = submitting || loading

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        
        // 입력 시 에러 클리어
        if (error) clearError()
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!form.email.trim()) {
            newErrors.email = '이메일을 입력해주세요.'
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.'
        }
        
        // 백엔드 SignupRequest의 패턴 검증과 일치
        if (!form.password) {
            newErrors.password = '비밀번호를 입력해주세요.'
        } else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,20}$/.test(form.password)) {
            newErrors.password = '비밀번호는 영문, 숫자, 특수문자 포함 8~20자여야 합니다.'
        }
        
        if (!disableFields.includes('confirmPassword')) {
            if (!form.confirmPassword) {
                newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
            } else if (form.password !== form.confirmPassword) {
                newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
            }
        }
        
        // 백엔드 SignupRequest의 닉네임 패턴 검증과 일치
        if (!form.nickname.trim()) {
            newErrors.nickname = '닉네임을 입력해주세요.'
        } else if (!/^[a-zA-Z0-9가-힣]{2,20}$/.test(form.nickname)) {
            newErrors.nickname = '닉네임은 2~20자의 한글, 영문 또는 숫자여야 합니다.'
        }
        
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            return
        }
        
        // 백엔드 SignupRequest 구조에 맞게 전송
        const submitData = {
            email: form.email.trim(),
            password: form.password,
            confirmPassword: form.confirmPassword,
            nickname: form.nickname.trim()
        }

        // 외부 onSubmit이 있으면 사용 (OAuth2 회원가입용)
        if (externalOnSubmit) {
            externalOnSubmit(submitData)
            return
        }

        // 일반 회원가입
        try {
            await signup(submitData).unwrap()
            alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.')
            navigate('/login')
        } catch (err) {
            console.error('회원가입 실패:', err)
        }
    }

    const isFieldDisabled = (fieldName) => {
        return disableFields.includes(fieldName) || isLoading
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email">이메일</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={isFieldDisabled('email')}
                    required
                    style={{ 
                        width: '100%', 
                        padding: '0.5rem',
                        marginTop: '0.25rem',
                        backgroundColor: isFieldDisabled('email') ? '#f5f5f5' : 'white'
                    }}
                />
                {externalErrors.email && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {externalErrors.email}
                    </p>
                )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="password">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    minLength={8}
                    style={{ 
                        width: '100%', 
                        padding: '0.5rem',
                        marginTop: '0.25rem'
                    }}
                />
                {externalErrors.password && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {externalErrors.password}
                    </p>
                )}
            </div>

            {!disableFields.includes('confirmPassword') && (
                <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    style={{ 
                    width: '100%', 
                    padding: '0.5rem',
                    marginTop: '0.25rem'
                    }}
                />
                {externalErrors.confirmPassword && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {externalErrors.confirmPassword}
                    </p>
                )}
                </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="nickname">닉네임</label>
                <input
                    id="nickname"
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    style={{ 
                        width: '100%', 
                        padding: '0.5rem',
                        marginTop: '0.25rem'
                    }}
                />
                {externalErrors.nickname && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {externalErrors.nickname}
                    </p>
                )}
            </div>

            {displayError && (
                <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {typeof displayError === 'string' ? displayError : '회원가입에 실패했습니다.'}
                </p>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                style={{ 
                width: '100%', 
                padding: '0.75rem',
                backgroundColor: isLoading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
            >
                {isLoading ? '처리 중...' : '회원가입'}
            </button>
        </form>
    )
}

export default SignupForm

    // const handleSubmit = async(e) => {
    //     e.preventDefault()
    //     try {
    //         await api.post('/auth/signup', form)
    //         alert('회원 가입 성공! 로그인 페이지로 이동합니다.')
    //         navigate('/login')
    //     } catch (err) {
    //         if (err.response?.status === 400) {
    //             setErrors(err.response.data) // 유효성 검사 실패
    //         } else if (err.response?.status === 409) {
    //             setErrors({email: '이미 사용중인 이메일 입니다.'})
    //         } else {
    //             alert('예상치 못한 오류가 발생했습니다.')
    //         }
    //     }
    // }

//   return (
//     <>
//         <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
//             <div>
//                 <label>이메일</label><br />
//                 <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 />
//                 {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
//             </div>

//             <div>
//                 <label>비밀번호</label><br />
//                 <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 />
//                 {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
//             </div>

//             <div>
//                 <label>비밀번호 확인</label><br />
//                 <input
//                 type="password"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 />
//                 {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
//                 {/* {errors.passwordConfirmed && (
//                 <p style={{ color: 'red' }}>{errors.passwordConfirmed}</p>
//                 )} */}
//             </div>

//             <div>
//                 <label>닉네임</label><br />
//                 <input
//                 type="text"
//                 name="nickname"
//                 value={form.nickname}
//                 onChange={handleChange}
//                 />
//                 {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname}</p>}
//             </div>

//             <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
//                 {loading ? '가입 중...' : '회원가입'}
//             </button>
//             {/* <button type="submit" style={{ marginTop: '1rem' }}>
//                 회원가입
//             </button> */}
//         </form>
//     </>
//   )
// }

// export default SignupForm
