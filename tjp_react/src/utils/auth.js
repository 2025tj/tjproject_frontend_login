import api from './axios'

export const getToken = () => {
    return localStorage.getItem('accessToken')
}
export const saveAccessTokenFromCookie = () => {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === 'accessToken') 
            localStorage.setItem('accessToken', decodeURIComponent(value))
            return
        
    }
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