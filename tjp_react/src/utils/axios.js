import axios from 'axios'
// import { getToken} from './auth'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // 쿠키 포함 요청 허용
})

// localStorage 방식
// api.interceptors.request.use((config) => {
//     const token = getToken()
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// })

export default api
