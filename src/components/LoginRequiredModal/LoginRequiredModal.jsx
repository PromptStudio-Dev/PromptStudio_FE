import React from "react";
import styled from "styled-components";
import LoginIcon from "./assets/loginRequiredIcon.svg";

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onLogin,
  icon = LoginIcon,
  text = "로그인 후 이용 가능합니다.",
  buttonText,
  onButtonClick,
  showCloseButton = true,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (onLogin) {
      onLogin();
    }
  };

  // buttonText가 없고 onLogin이 있으면 기본값 "로그인 하기" 사용
  const displayButtonText = buttonText || (onLogin ? "로그인 하기" : undefined);
  const shouldShowButton = Boolean(displayButtonText);

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <HeaderRow>
          <LoginIconImg src={icon} alt="modal-icon" />
          {showCloseButton && (
            <CloseButton onClick={onClose}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CloseButton>
          )}
        </HeaderRow>
        <ModalText>{text}</ModalText>
        {shouldShowButton && (
          <LoginButton onClick={handleButtonClick}>
            {displayButtonText}
          </LoginButton>
        )}
      </ModalContainer>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 22vw;
  height: auto;
  border-radius: 1.625rem;
  background: #282828;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16);
  padding: 1.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  width: 1.75rem;
  height: 1.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const LoginIconImg = styled.img`
  width: 2.25rem;
  height: 2.25rem;
`;

const ModalText = styled.div`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  margin-top: 0.58rem;
  margin-bottom: 2.25rem;
  line-height: normal;
`;

const LoginButton = styled.button`
  display: flex;
  width: 11rem;
  padding: 0.375rem 0.625rem;
  justify-content: center;
  background: none;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid var(--Light-blue, #49d8ff);
  color: #49d8ff;
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-weight: 600;
`;
