import { createSlice } from '@reduxjs/toolkit'
import { 
  loginThunk, 
  logoutThunk, 
  refreshTokenThunk, 
  signupThunk,
  requestPasswordResetThunk, 
  resetPasswordThunk,
  initializeAuthThunk,
  validateTokenThunk,
  completeOAuth2Thunk
} from './authThunks'

const initialState = {
    isAuthenticated: false,
    user: null,
    warning : null,
    accessToken : null,
    loading: false,
    error: null,
    initialized: false, // 앱 초기화 완료 여부
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // 동기 액션들, 단순 상태 변경
        clearError: (state) => {
            state.error = null;
        },
        clearWarning: (state) => {
            state.warning = null;
        },
        setWarning: (state, action) => {
            state.warning = action.payload;
        },
        resetAuthState(state) {
            Object.assign(state, initialState)
        },
        // 토큰만 업데이트 (인터셉터에서 사용)
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload
        }
    },
    extraReducers: (builder) => {
        // 비동기 액션들 처리
        builder
            // 앱 초기화
            .addCase(initializeAuthThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(initializeAuthThunk.fulfilled, (state, action) => {
                state.loading = false
                state.initialized = true
                if (action.payload) {
                state.isAuthenticated = true
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
                }
            })
            .addCase(initializeAuthThunk.rejected, (state) => {
                state.loading = false
                state.initialized = true
                state.isAuthenticated = false
                state.user = null
                state.accessToken = null
            })
            // 로그인
            .addCase(loginThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
                state.warning = action.payload.warning
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.isAuthenticated = false
                state.user = null
                state.accessToken = null
            })
            // 로그아웃
            .addCase(logoutThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loading = false
                state.isAuthenticated = false
                state.user = null
                state.accessToken = null
                state.warning = null
            })
            .addCase(logoutThunk.rejected, (state) => {
                // 로그아웃은 실패해도 클라이언트 상태는 정리
                state.loading = false
                state.isAuthenticated = false
                state.user = null
                state.accessToken = null
                state.warning = null
            })
            // 토큰 갱신
            .addCase(refreshTokenThunk.pending, (state) => {
                // 백그라운드 갱신이므로 loading을 true로 하지 않음
                state.error = null
            })
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken
                if (action.payload.user) {
                state.user = action.payload.user
                state.isAuthenticated = true
                }
            })
            .addCase(refreshTokenThunk.rejected, (state) => {
                state.isAuthenticated = false
                state.user = null
                state.accessToken = null
            })
            // 회원가입
            .addCase(signupThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signupThunk.fulfilled, (state) => {
                state.loading = false
                // 회원가입 후 자동 로그인하지 않음
            })
            .addCase(signupThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // 비밀번호 재설정 요청
            .addCase(requestPasswordResetThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(requestPasswordResetThunk.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(requestPasswordResetThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // 비밀번호 재설정
            .addCase(resetPasswordThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(resetPasswordThunk.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(resetPasswordThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // 토큰 검증
            .addCase(validateTokenThunk.fulfilled, (state, action) => {
                if (!action.payload.isValid) {
                state.isAuthenticated = false
                state.user = null
                state.accessToken = null
                }
            })
            // OAuth2 완료 처리
            .addCase(completeOAuth2Thunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(completeOAuth2Thunk.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload.user && action.payload.accessToken) {
                state.isAuthenticated = true
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
                }
            })
            .addCase(completeOAuth2Thunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { 
  clearError, 
  clearWarning, 
  setWarning, 
  resetAuthState,
  updateAccessToken 
} = authSlice.actions
const authReducer = authSlice.reducer
export default authReducer
        // login(state, action) {
        //     state.isAuthenticated = true
        //     state.user = action.payload
        // },
        // logout(state) {
        //     state.isAuthenticated = false
        //     state.user = null
        //     state.accessToken = null
        //     state.warning= null
        // },
        // setWarning: (state, action) => {
        //     state.warning = action.payload
        // },
        // clearWarning: (state) => {
        //     state.warning = null
        // },
        // setAccessToken(state, action) {
        //     state.accessToken = action.payload
        // },
        // clearAccessToken(state) {
        //     state.accessToken = null
        // },
        // //완전한 상태 초기화 액션
        // resetAuthState(state) {
        //     Object.assign(state, initialState)
        //     console.log('Auth 상태 완전 초기화')
        // }
//     }
// }) 

// // export const { login, logout, setWarning, clearWarning, setAccessToken, clearAccessToken, resetAuthState } = authSlice.actions
// export const { clearError, clearWarning, setWarning, login, logout, setAccessToken, clearAccessToken, resetAuthState } = authSlice.actions;
// export default authSlice.reducer
