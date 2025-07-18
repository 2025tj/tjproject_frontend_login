import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
    warning : null,
    accessToken : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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
        setWarning: (state, action) => {
            state.warning = action.payload
        },
        clearWarning: (state) => {
            state.warning = null
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload
        },
        clearAccessToken(state) {
            state.accessToken = null
        },
        //완전한 상태 초기화 액션
        resetAuthState(state) {
            Object.assign(state, initialState)
            console.log('Auth 상태 완전 초기화')
        }
    }
}) 

export const { login, logout, setWarning, clearWarning, setAccessToken, clearAccessToken, resetAuthState } = authSlice.actions
export default authSlice.reducer
