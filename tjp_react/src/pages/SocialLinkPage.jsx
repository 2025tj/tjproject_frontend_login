import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import api from '../utils/axios'

const SocialLinkPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const email = searchParams.get('email')
    const provider = searchParams.get('provider')

    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [linked, setLinked] = useState(false)

    useEffect(() => {
        if (!email || !provider) {
        setError('잘못된 요청입니다.')
        }
    }, [email, provider])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // 1. 기존 사용자 비밀번호로 로그인
            await api.post('/auth/login', {
            email,
            password
            }, { withCredentials: true })

            // 2. 로그인 성공 후, 쿠키로 받은 oneTimeLink 토큰 기반으로 연동 요청
            await api.post('/social/link',
                { email, provider },
                { withCredentials: true })

            setLinked(true)
            setTimeout(() => navigate('/mypage'), 1000)

        } catch (err) {
        setError('비밀번호가 올바르지 않거나 연동 중 오류가 발생했습니다.')
        console.error(err)
        } finally {
        setLoading(false)
        }
    }

    if (error) return <div style={{ color: 'red' }}>{error}</div>

    if (linked) return <h2> 연동이 완료되었습니다. 마이페이지로 이동 중...</h2>
  return (
    <div>
        <h2>🔐 소셜 계정 연동 확인</h2>
        <p><b>{email}</b> 계정에 <b>{provider}</b> 계정을 연동하려고 합니다.</p>
        <p>계속하려면 해당 계정의 비밀번호를 입력해주세요.</p>

        <form onSubmit={handleSubmit}>
            <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button type="submit" disabled={loading}>
                {loading ? '연동 중...' : '연동하기'}
            </button>
        </form>
    </div>
  )
}

export default SocialLinkPage
