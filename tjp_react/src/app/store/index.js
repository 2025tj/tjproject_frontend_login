import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@features/auth/store'

console.log('authReducer:', authReducer)

const store = configureStore ({
    reducer: {
        auth: authReducer
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

