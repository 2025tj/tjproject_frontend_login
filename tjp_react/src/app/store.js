import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import authReducer from '../features/auth/authSlice'

export const store = configureStore ({
    reducer: {
        auth: authReducer
    }
})