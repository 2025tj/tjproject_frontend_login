import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import authReducer from '@features/auth/store/authSlice'

const store = configureStore ({
    reducer: {
        auth: authReducer
    }
})

export default store

