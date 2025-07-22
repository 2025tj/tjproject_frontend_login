import React from 'react'
import { createSlice } from '@reduxjs/toolkit'
import { loginThunk, logoutThunk, refreshTokenThunk, requestPasswordResetThunk, resetPasswordThunk } from './authThunks';

const initialState = {
    isAuthenticated: false,
    user: null,
    warning : null,
    accessToken : null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // 동기 액션들
        clearError: (state) => {
            state.error = null;
        },
        clearWarning: (state) => {
            state.warning = null;
        },
        setWarning: (state, action) => {
            state.warning = action.payload;
        },
        login(state, action) {
            state.isAuthenticated = true
            state.user = action.payload
        },
        logout(state) {
            state.isAuthenticated = false
            state.user = null
            state.accessToken = null
            state.warning= null
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload
        },
        clearAccessToken(state) {
            state.accessToken = null
        },
        resetAuthState(state) {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        // 비동기 액션들 처리
        builder
            // 로그인 thunk
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.warning = action.payload.warning;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 로그아웃 thunk
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.warning = null;
            })
            // 토큰 갱신 thunk
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
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
    }
}) 

// export const { login, logout, setWarning, clearWarning, setAccessToken, clearAccessToken, resetAuthState } = authSlice.actions
export const { clearError, clearWarning, setWarning, login, logout, setAccessToken, clearAccessToken, resetAuthState } = authSlice.actions;
export default authSlice.reducer
