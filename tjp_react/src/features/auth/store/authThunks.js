import { createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../api'
import { extractAccessToken, isTokenExpired } from '../utils'

// 중복 요청 방지를 위한 Promise 캐시
let refreshPromise = null

// 앱 초기화 thunk (토큰 검증 + 사용자 정보 로드)
export const initializeAuthThunk = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // 먼저 refresh 시도 (쿠키에 refreshToken이 있다면)
      const refreshResponse = await authApi.refresh()
      const accessToken = extractAccessToken(refreshResponse.headers)
      
      if (accessToken) {
        // 사용자 정보 조회
        const userResponse = await authApi.getProfile()
        return {
          user: userResponse.data,
          accessToken
        }
      }
      
      return null
    } catch (error) {
      // 초기화 실패는 에러가 아님 (비로그인 상태일 수 있음)
      return null
    }
  }
)

// 로그인 thunk
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      const accessToken = extractAccessToken(response.headers)
      
      if (!accessToken) {
        throw new Error('토큰을 받지 못했습니다.')
      }
      
      // 사용자 정보 조회
      const userResponse = await authApi.getProfile()
      
      return {
        user: userResponse.data,
        accessToken,
        warning: response.data?.warning
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '로그인에 실패했습니다.'
      return rejectWithValue(message)
    }
  }
)

// 로그아웃 thunk
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('서버 로그아웃 실패:', error)
      // 서버 로그아웃이 실패해도 클라이언트는 정리해야 함
    }
    // 항상 성공으로 처리 (클라이언트 정리는 리듀서에서)
    return true
  }
)

// 토큰 갱신 thunk (중복 요청 방지)
export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    // 이미 갱신 중이면 기존 Promise 반환
    if (refreshPromise) {
      try {
        return await refreshPromise
      } catch (error) {
        return rejectWithValue('토큰 갱신 실패')
      }
    }
    
    refreshPromise = (async () => {
      try {
        const response = await authApi.refresh()
        const accessToken = extractAccessToken(response.headers)
        
        if (!accessToken) {
          throw new Error('새로운 토큰을 받지 못했습니다.')
        }
        
        // 현재 사용자 정보가 없다면 함께 조회
        const currentUser = getState().auth.user
        let user = currentUser
        
        if (!currentUser) {
          try {
            const userResponse = await authApi.getProfile()
            user = userResponse.data
          } catch (userError) {
            console.warn('사용자 정보 조회 실패:', userError)
          }
        }
        
        return { accessToken, user }
      } finally {
        refreshPromise = null
      }
    })()
    
    try {
      return await refreshPromise
    } catch (error) {
      refreshPromise = null
      return rejectWithValue('토큰 갱신 실패')
    }
  }
)

// 회원가입 thunk
export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      await authApi.signup(userData)
      return { message: '회원가입이 완료되었습니다.' }
    } catch (error) {
      // 백엔드 ErrorResponse 구조 처리
      if (error.response?.data) {
        const errorData = error.response.data
        
        // ValidationError들이 있는 경우
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationErrors = {}
          errorData.errors.forEach(err => {
            validationErrors[err.field] = err.message
          })
          return rejectWithValue(validationErrors)
        }
        
        // ApiResponse 에러 구조인 경우
        if (errorData.success === false) {
          return rejectWithValue(errorData.message || '회원가입에 실패했습니다.')
        }
        
        // 기타 에러 응답
        return rejectWithValue(errorData.message || errorData)
      }
      
      const message = error.message || '회원가입에 실패했습니다.'
      return rejectWithValue(message)
    }
  }
)

// 비밀번호 재설정 요청 thunk
export const requestPasswordResetThunk = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      await authApi.requestPasswordReset(email)
      return { message: '비밀번호 재설정 링크가 발송되었습니다.' }
    } catch (error) {
      const message = error.response?.data?.message || '요청 처리에 실패했습니다.'
      return rejectWithValue(message)
    }
  }
)

// 비밀번호 재설정 thunk
export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      await authApi.resetPassword(token, newPassword, confirmPassword)
      return { message: '비밀번호가 성공적으로 재설정되었습니다.' }
    } catch (error) {
      const message = error.response?.data?.message || '비밀번호 재설정에 실패했습니다.'
      return rejectWithValue(message)
    }
  }
)

// 토큰 검증 thunk
export const validateTokenThunk = createAsyncThunk(
  'auth/validateToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth
      
      if (!accessToken) {
        return { isValid: false }
      }
      
      if (isTokenExpired(accessToken)) {
        return { isValid: false }
      }
      
      // 서버에서 토큰 유효성 검증
      await authApi.getProfile()
      return { isValid: true }
    } catch (error) {
      return { isValid: false }
    }
  }
)

// OAuth2 관련 thunk들---
// OAuth2 완료 처리 thunk
export const completeOAuth2Thunk = createAsyncThunk(
  'auth/completeOAuth2',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.completeOAuth2()
      const accessToken = extractAccessToken(response.headers)
      
      if (accessToken) {
        const userResponse = await authApi.getProfile()
        return {
          user: userResponse.data,
          accessToken
        }
      }
      
      return { message: 'OAuth2 처리 완료' }
    } catch (error) {
      const message = error.response?.data?.message || 'OAuth2 완료 처리에 실패했습니다.'
      return rejectWithValue(message)
    }
  }
)

// export const handleOAuth2RedirectThunk = createAsyncThunk(
//   'auth/handleOAuth2Redirect',
//   async ({ searchParams }, { rejectWithValue }) => {
//     try {
//       const error = searchParams.get('error')
//       const link = searchParams.get('link') === 'true'
      
//       if (error) {
//         throw new Error(error)
//       }
      
//       if (link) {
//         // 연동 플로우 처리
//         const linkResponse = await authApi.getPendingSocialLink()
//         return { 
//           type: 'link',
//           data: linkResponse.data
//         }
//       }
      
//       // 정상 로그인 플로우
//       const response = await authApi.completeOAuth2()
//       const accessToken = extractAccessToken(response.headers)
//       const userResponse = await authApi.getProfile()
      
//       return {
//         type: 'login',
//         data: {
//           user: userResponse.data,
//           accessToken
//         }
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'OAuth2 처리 중 오류가 발생했습니다.')
//     }
//   }
// )

// export const linkSocialAccountThunk = createAsyncThunk(
//   'auth/linkSocialAccount',
//   async ({ email, password, provider }, { rejectWithValue }) => {
//     try {
//       // 로컬 로그인으로 인증
//       await authApi.login({ email, password })
      
//       // 소셜 계정 연동
//       await authApi.linkSocial(provider, email)
      
//       // OAuth2 완료 처리
//       const response = await authApi.completeOAuth2()
//       const accessToken = extractAccessToken(response.headers)
//       const userResponse = await authApi.getProfile()
      
//       return {
//         user: userResponse.data,
//         accessToken
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || '계정 연동에 실패했습니다.'
//       return rejectWithValue(message)
//     }
//   }
// )


















// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { authApi } from '../api';
// // import { saveAccessFromHeaders, saveUserInfo, removeUserInfo, removeAccessToken } from '../utils';
// import { saveAccessFromHeaders, saveUserInfo, removeAccessToken, removeUserInfo } from '../utils'

// // 로그인 thunk
// export const loginThunk = createAsyncThunk(
//     'auth/login',
//     async (credentials, { rejectWithValue }) => {
//         try {
//             const response = await authApi.login(credentials);
        
//             // 토큰 저장
//             saveAccessFromHeaders(response.headers);
            
//             // 사용자 정보 조회
//             const userResponse = await authApi.getProfile();
//             const user = userResponse.data;
            
//             return {
//                 user,
//                 accessToken: response.headers['access-token'],
//                 warning: response.data.warning
//             };
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || '로그인 실패');
//         }
//     }
// )

// // 로그아웃 thunk
// export const logoutThunk = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await authApi.logout();
//     } catch (error) {
//       console.error('서버 로그아웃 실패:', error);
//     } finally {
//       // 클라이언트 정리는 항상 실행
//       removeUserInfo();
//       removeAccessToken();
//     }
//   }
// )

// // 토큰 갱신 thunk
// export const refreshTokenThunk = createAsyncThunk(
//   'auth/refreshToken',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authApi.refresh();
//       saveAccessFromHeaders(response.headers);
      
//       return {
//         accessToken: response.headers['access-token']
//       };
//     } catch (error) {
//       removeAccessToken();
//       return rejectWithValue('토큰 갱신 실패');
//     }
//   }
// )

// // 회원가입 thunk
// export const signupThunk = createAsyncThunk(
//   'auth/signup',
//   async (userData, { rejectWithValue }) => {
//     try {
//       await authApi.signup(userData);
//       return { message: '회원가입 성공' };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || '회원가입 실패');
//     }
//   }
// )

// // 비밀번호 재설정 요청 thunk
// export const requestPasswordResetThunk = createAsyncThunk(
//   'auth/requestPasswordReset',
//   async (email, { rejectWithValue }) => {
//     try {
//       await authApi.requestPasswordReset(email);
//       return { message: '재설정 링크가 발송되었습니다.' };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || '요청 실패');
//     }
//   }
// )

// export const resetPasswordThunk = createAsyncThunk(
//   'auth/resetPassword',
//   async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
//     try {
//       await authApi.resetPassword(token, newPassword, confirmPassword)
//       return { message: '비밀번호가 성공적으로 재설정되었습니다.' }
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || '재설정 실패')
//     }
//   }
// )