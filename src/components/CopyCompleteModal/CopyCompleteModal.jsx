import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export default function CopyCompleteModal({
  isOpen,
  message = "복사가 완료 되었습니다",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 약간의 딜레이 후 애니메이션 시작
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // 애니메이션이 끝난 후 렌더링 중지
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <Overlay $isVisible={isVisible}>
      <ModalContainer $isVisible={isVisible}>
        <ModalText>{message}</ModalText>
      </ModalContainer>
    </Overlay>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10rem;
  z-index: 9999;
  pointer-events: none;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 22vw;
  height: auto;
  border-radius: 1rem;
  background: #282828;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16);
  padding: 1.5rem;
  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} 0.3s
    ease-out forwards;
`;

const ModalText = styled.div`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
