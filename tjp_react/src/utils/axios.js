import axios from 'axios'
import { getToken} from './auth'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // 쿠키 포함 요청 허용
})

// 요청 인터셉터: accessToken
api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

api.interceptors.response.use(
    res => res,
    async err => {
        if (err.response?.status === 401) {
            try {
                const res= await axios.post('http://localhost:8080/api/users/refresh', {}, {withCredentials:true})
                const newToken = res.data.accessToken
                localStorage.setItem("accessToken", newToken)

                // 원래 요청 재시도
                err.config.headers.Authorization = `Bearer ${newToken}`
                return axios(err.config)
            } catch (e) {
                localStorage.removeItem("accessToken")
                if (window.location.pathname !== '/login') {
                    window.location.href = "/login"
                }
                
            }
        }
        return Promise.reject(err)
    }
)

export default api
