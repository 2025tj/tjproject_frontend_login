import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreUserThunk } from '@features/auth/store/authThunk'

export const useAuthInit = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(restoreUserThunk())
  }, [dispatch])
}