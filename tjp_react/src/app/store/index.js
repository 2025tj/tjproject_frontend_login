import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import authReducer from '@features/auth/store/authSlice'
import userReducer from '@features/user/store/userSlice'

const store = configureStore ({
    reducer: {
        auth: authReducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store

