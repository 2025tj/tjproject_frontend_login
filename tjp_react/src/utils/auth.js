import api from './axios'

export const getToken = () => {
    return localStorage.getItem('accessToken')
}

// export const isLoggedIn = () => {
//     return !!getToken()
// }

export const checkLogin = async () => {
    try {
        const res = await api.get('/users/me')
        return res.data
        // return res.data.email // 예: 이메일주소
    } catch {
        return null
    }
}