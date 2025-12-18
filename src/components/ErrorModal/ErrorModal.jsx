import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import WarningIcon from "../LoginRequiredModal/assets/warningIcon.svg";

export default function ErrorModal({
  isOpen,
  onClose,
  text = "",
  autoCloseDelay = 3000,
}) {
  const timeoutRef = useRef(null);
  console.log("ErrorModal rendered", text, [...text]);
  useEffect(() => {
    if (isOpen) {
      // 이전 타이머가 있으면 클리어
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 자동 닫기
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <HeaderRow>
          <WarningIconImg src={WarningIcon} alt="warning-icon" />
        </HeaderRow>
        <ModalText>{text.replace(/\\n/g, "\n")}</ModalText>
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
  pointer-events: none;
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
  pointer-events: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
`;

const WarningIconImg = styled.img`
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
  white-space: pre-line;
  text-align: center;
`;
