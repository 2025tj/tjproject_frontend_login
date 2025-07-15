import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null
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
        },
        setWarning: (state, action) => {
            state.warning = action.payload
        },
        clearWarning: (state) => {
            state.warning = null
        }
    }
}) 

export const { login, logout, setWarning, clearWarning } = authSlice.actions
export default authSlice.reducer
