// import { useEffect} from 'react'
// import api, {refreshApi} from '../api/axios'
// import { extractAccessToken } from './authUtils'

// const useAuth = () => {
//     const { accessToken, setAccessToken, clearAccessToken} = useAuthStore()

//     useEffect(()=> {
//         const fetchNewToken = async () => {
//             try {
//                 const res = await refreshApi.post('/refresh')
//                 const token = extractAccessToken(res.headers)
//                 if (token) setAccessToken(token)
//             } catch {
//                 clearAccessToken()
//             }
//         }
//         fetchNewToken()
//     }, [])

//     return { accessToken, setAccessToken:(token) => dispatchEvent(setAccessToken(token)), clearAccessToken:()=> dispatchEvent(clearAccessToken())}
// }

// export default useAuth