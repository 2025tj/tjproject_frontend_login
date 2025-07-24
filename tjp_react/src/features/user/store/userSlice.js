import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.profile = action.payload
    },
    setUserLoading(state, action) {
      state.loading = action.payload
    },
    setUserError(state, action) {
      state.error = action.payload
    },
    clearUserState(state) {
      state.profile = null
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setUserProfile,
  setUserLoading,
  setUserError,
  clearUserState,
} = userSlice.actions