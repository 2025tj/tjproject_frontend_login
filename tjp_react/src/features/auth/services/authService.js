import { getAccessToken, isTokenExpired } from "../utils";

export const authService = {
    isAuthenticated: () => {
        const token = getAccessToken()
        return !!token && !isTokenExpired(token)
    },
    getToken: () => {
        return getAccessToken()
    },
}