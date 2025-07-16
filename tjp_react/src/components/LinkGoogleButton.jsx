import React from 'react'

const LinkOauth2Button = () => {
     const handleLogin = () => {
        window.location.href = `http://localhost:8080/oauth2/authorization/google?link=true` +
            `&redirect_uri=${encodeURIComponent('http://localhost:5173/oauth2/link-callback')}`
    }

    return (
        <button onClick={handleLogin}>
            구글 연동
        </button>
    )
}

export default LinkOauth2Button
