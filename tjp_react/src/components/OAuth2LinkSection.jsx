import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import Modal from './modals/Modal';
import SocialLoginModal from './modals/OAuth2LinkModal';
import OAuth2LinkModal from './modals/OAuth2LinkModal';

const OAuth2LinkSection = () => {
  const [linkedProviders, setLinkedProviders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const supportedProviders = ['google', 'kakao'];

  useEffect(() => {
        fetchLinkedProviders();
    }, []);

  const fetchLinkedProviders = async () => {
    try {
      const response = await api.get('/social/linked-providers');
      setLinkedProviders(response.data);  
    } catch (error) {
      console.error('연동된 계정 조회 실패:', error);
    }
  };

  const handleSocialLink = (provider) => {
    // 모달 대신 현재 창에서 OAuth2 페이지로 이동
    // 연동 완료 후 다시 마이페이지로 돌아옴
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}?mode=link`;
  };

  // const handleSocialLink = (provider) => {
  //   setIsProcessing(provider);
  //   setModalOpen(true);
  // };

  // const handleLinkSuccess = (provider) => {
  //   alert(`${provider} 계정 연동 완료!`);
  //   fetchLinkedProviders();
  //   setModalOpen(false);
  //   setSelectedProvider(null);
  // };

  // const handleLinkError = () => {
  //   alert('소셜 계정 연동 실패');
  //   setModalOpen(false);
  //   setSelectedProvider(null);
  // };
      
  const handleSocialUnlink = async (provider) => {
    if (!confirm(`${provider} 계정 연동을 해제하시겠습니까?`)) return;

    try {
      await api.delete(`/social/unlink/${provider}`);
      alert('연동이 해제되었습니다.');
      fetchLinkedProviders();
    } catch (error) {
      alert('연동 해제 실패');
    }
  };
    
  // const closeModal = () => {
  //   setModalOpen(false);
  //   setSelectedProvider(null);
  // };

  return (
    <div>
      <h2>소셜 계정 연동</h2>
      {supportedProviders.map((provider) => {
        const isLinked = linkedProviders.includes(provider);
        return (
          <div key={provider}>
            <span>{provider}: {isLinked ? '연동됨' : '연동안됨'}</span>
            {isLinked ? (
              <button onClick={() => handleSocialUnlink(provider)} disabled={isProcessing}>
                연동해제
              </button>
            ) : (
              <button onClick={() => handleSocialLink(provider)} disabled={isProcessing}>
                {isProcessing ? '처리중...' : '연동하기'}
              </button>
            )}
          </div>
        );
      })}

      {/* <Modal isOpen={modalOpen} onClose={closeModal}>
        <OAuth2LinkModal
          provider={selectedProvider}
          onSuccess={handleLinkSuccess}
          onError={handleLinkError}
          onClose={closeModal}
        />
      </Modal> */}

    </div>
  )
}

export default OAuth2LinkSection
