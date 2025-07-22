import React, { useEffect } from 'react'
import { useAuth } from '@features/auth/hooks/useAuth'

const overlayStyle = {
  position: 'fixed',
  top: 0, 
  left: 0, 
  right: 0, 
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1500,
  animation: 'fadeIn 0.2s ease-in'
}

const modalStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem 2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  maxWidth: '400px',
  width: '90%',
  textAlign: 'center',
  fontSize: '1rem',
  color: '#333',
  position: 'relative',
  animation: 'slideIn 0.3s ease-out'
}

const closeBtnStyle = {
  position: 'absolute',
  top: '8px',
  right: '12px',
  fontSize: '1.2rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#999',
  lineHeight: 1
}

const messageStyle = {
  margin: '0.5rem 0 0 0',
  lineHeight: '1.4'
}

const GlobalAlert = () => {
  const { warning, clearWarning } = useAuth()

  // 자동 닫기 (3초 후)
  useEffect(() => {
    if (!warning) return

    const timer = setTimeout(() => {
      clearWarning()
    }, 3000)

    return () => clearTimeout(timer)
  }, [warning, clearWarning])

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && warning) {
        clearWarning()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [warning, clearWarning])

  if (!warning) return null

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      
      <div 
        style={overlayStyle} 
        onClick={clearWarning}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-title"
      >
        <div
          style={modalStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={clearWarning}
            style={closeBtnStyle}
            aria-label="경고 메시지 닫기"
            title="닫기"
          >
            ×
          </button>
          
          <div id="alert-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            ⚠️ 알림
          </div>
          
          <p style={messageStyle}>
            {warning}
          </p>
          
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#999', 
            marginTop: '1rem'
          }}>
            3초 후 자동으로 닫힙니다
          </div>
        </div>
      </div>
    </>
  )
}

export default GlobalAlert

// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { clearWarning } from '@features/auth/store/authSlice';
// import { useAuth } from '../../../features/auth/hooks/useAuth';

// const overlayStyle = {
//   position: 'fixed',
//   top: 0, left: 0, right: 0, bottom: 0,
//   backgroundColor: 'rgba(0,0,0,0.5)',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   zIndex: 1500,
// };

// const modalStyle = {
//   backgroundColor: '#fff',
//   padding: '1.5rem 2rem',
//   borderRadius: '8px',
//   boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//   maxWidth: '400px',
//   width: '90%',
//   textAlign: 'center',
//   fontSize: '1rem',
//   color: '#333',
//   position: 'relative',
// };

// const closeBtnStyle = {
//   position: 'absolute',
//   top: '8px',
//   right: '12px',
//   fontSize: '1.2rem',
//   background: 'none',
//   border: 'none',
//   cursor: 'pointer',
// };

// const GlobalModalAlert = () => {
//   // const warning = useSelector(state => state.auth.warning)
//   const dispatch = useDispatch()
//   const { warning, clearWarning } = useAuth()

//   // // 1.5초 후 자동 닫기
//   useEffect(() => {
//     if (!warning) return;
//     const timer = setTimeout(() => {
//       clearWarning();
//     }, 1500);
//     return () => clearTimeout(timer);
//   }, [warning, clearWarning]);
//   // useEffect(() => {
//   //   if (!warning) return;
//   //   const timer = setTimeout(() => {
//   //     dispatch(clearWarning());
//   //   }, 1500);
//   //   return () => clearTimeout(timer);
//   // }, [warning, dispatch]);

//   if (!warning) return null;

//   return (
//     <div style={overlayStyle} onClick={clearWarning}>
//       <div style={modalStyle} onClick={e => e.stopPropagation()}>
//         <button onClick={clearWarning} style={closeBtnStyle}>
//           &times;
//         </button>
//         <p>⚠️ {warning}</p>
//       </div>
//     </div>
//     // <div style={overlayStyle} onClick={() => dispatch(clearWarning())}>
//     //   <div
//     //     style={modalStyle}
//     //     onClick={e => e.stopPropagation()} // 모달 밖 클릭시 닫히지만, 모달 안 클릭은 닫히지 않게
//     //     role="alertdialog"
//     //     aria-live="assertive"
//     //     aria-modal="true"
//     //   >
//     //     <button
//     //       aria-label="Close alert"
//     //       onClick={() => dispatch(clearWarning())}
//     //       style={closeBtnStyle}
//     //     >
//     //       &times;
//     //     </button>
//     //     <p>⚠️ {warning}</p>
//     //   </div>
//     // </div>
//   )
// }

// export default GlobalModalAlert
