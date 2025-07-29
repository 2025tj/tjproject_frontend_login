
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
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  warning: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
            state.isAuthenticated = true
        },
        setLoading(state, action) {
            state.loading = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        },
        setWarning(state, action) {
            state.warning = action.payload
        },
        clearWarning(state) {
            state.warning = null
        },
        clearAuth(state) {
            state.user = null
            state.isAuthenticated = false
            state.error = null
            state.warning = null
        }
    },
}) 

export const { setUser, setLoading, setError, setWarning, clearWarning, clearAuth } = authSlice.actions
export default authSlice.reducer
