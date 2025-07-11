import axios from 'axios'
import { getToken} from './auth'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // 쿠키 포함 요청 허용
})

// 요청 인터셉터: accessToken 헤더에 추가
api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},(error) => Promise.reject(error))

// accessToken 만료시 재발급
api.interceptors.response.use(
    res => res,
    async err => {
        const originalConfig = err.config
        if (err.response?.status === 401 && !originalConfig._retry) {
            originalConfig._retry =true
            try {
                const res= await axios.post(
                    'http://localhost:8080/api/auth/refresh',
                    {},
                    {withCredentials:true}) // 쿠키 전송
                const newToken = res.data.accessToken
                localStorage.setItem("accessToken", newToken)

                // 원래 요청 재시도
                originalConfig.headers.Authorization = `Bearer ${newToken}`
                return api(originalConfig)
            } catch (e) {
                localStorage.removeItem("accessToken")
                window.location.href='/login'
                
            }
        }
        return Promise.reject(err)
    }
)

export default api
