import React from 'react'
import { useAuth } from '@features/auth/hooks/useAuth'

const HomePage = () => {
  const { isAuthenticated, user, getUserDisplayName } = useAuth()

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>홈 화면입니다</h1>
      
      {isAuthenticated ? (
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>환영합니다! 👋</h2>
          <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
            <strong>{getUserDisplayName()}</strong>님, 안녕하세요!
          </p>
          {user?.emailVerified ? (
            <p style={{ color: 'green', margin: '0.5rem 0' }}>
              ✅ 이메일 인증 완료
            </p>
          ) : (
            <p style={{ color: 'orange', margin: '0.5rem 0' }}>
              ⏳ 이메일 인증이 필요합니다. 
              <a href="/mypage" style={{ marginLeft: '0.5rem', color: '#007bff' }}>
                마이페이지에서 인증하기
              </a>
            </p>
          )}
        </div>
      ) : (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #90caf9'
        }}>
          <h2>서비스를 이용하려면 로그인하세요</h2>
          <p style={{ margin: '1rem 0' }}>
            로그인하시면 더 많은 기능을 이용할 수 있습니다.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href="/login"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              로그인
            </a>
            <a 
              href="/signup"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              회원가입
            </a>
          </div>
        </div>
      )}
      
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h2>서비스 소개</h2>
        <p style={{ lineHeight: '1.6', color: '#666' }}>
          이곳은 React + Redux Toolkit + Spring Boot로 구성된<br/>
          완전한 사용자 인증 시스템을 제공하는 웹 애플리케이션입니다.
        </p>
        
        <h3 style={{ marginTop: '1.5rem', color: '#333' }}>주요 기능</h3>
        <ul style={{ lineHeight: '1.8', color: '#555' }}>
          <li>✅ 일반 로그인/회원가입</li>
          <li>🔑 소셜 로그인 (Google, Kakao)</li>
          <li>📧 이메일 인증</li>
          <li>🔒 비밀번호 재설정</li>
          <li>🔗 소셜 계정 연동/해제</li>
          <li>👤 프로필 관리</li>
          <li>🛡️ JWT 기반 보안 인증</li>
        </ul>
      </div>
    </div>
  )
}

export default HomePage