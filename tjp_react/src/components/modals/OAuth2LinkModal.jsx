import React, { useEffect } from 'react';

const OAuth2LinkModal = ({ provider, onSuccess, onError, onClose }) => {
  useEffect(() => {
    if (!provider) return;

    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:8080/oauth2/authorization/${provider}?mode=link`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    const container = document.getElementById('social-login-iframe');
    if (container) {
      container.appendChild(iframe);
    }

    // 메시지 리스너
    const messageListener = (event) => {
      if (event.data?.type === 'SOCIAL_LINK_SUCCESS') {
        onSuccess?.(event.data.provider);
        onClose();
      } else if (event.data?.type === 'SOCIAL_LINK_ERROR') {
        onError?.();
        onClose();
      }
    };

    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
      if (container && iframe) {
          container.removeChild(iframe);
      }
    };
  }, [provider, onSuccess, onError, onClose]);
  return (
    <div>
      <h3>{provider} 계정 연동</h3>
      <p>아래에서 {provider} 로그인을 완료해주세요.</p>
      <div id="social-login-iframe" style={{ height: '500px' }}></div>
    </div>
  )
}

export default OAuth2LinkModal
