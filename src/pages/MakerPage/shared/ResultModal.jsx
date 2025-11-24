import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import ExpandIconImg from "../assets/result-modal-expansion-button.svg";
import CloseIconImg from "../assets/result-modal-close-button.svg";

export default function ResultModal({ isOpen, onClose, onExpand }) {
  // 모달 크기는 CSS에서 관리하고, JavaScript에서는 실제 렌더링된 크기를 사용
  const modalRef = useRef(null);

  const getModalSize = useCallback(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    // 초기값 (1920px 기준)
    return { width: 535, height: 665 };
  }, []);

  const [position, setPosition] = useState(() => {
    // 초기 위치를 바로 계산
    if (typeof window !== "undefined") {
      const size = getModalSize();
      // 오른쪽 여백 (2rem = 32px @ 16px)
      const rightMargin = 32;
      return {
        x: window.innerWidth - size.width - rightMargin,
        y: window.innerHeight - size.height - 27,
      };
    }
    return { x: 0, y: 0 };
  });

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 위치를 확실하게 설정
      const updateSizeAndPosition = () => {
        // 실제 렌더링된 크기 가져오기
        const currentSize = getModalSize();
        const currentWidth = currentSize.width;
        const currentHeight = currentSize.height;

        // 오른쪽 여백 (2rem = 32px @ 16px 기준, 반응형은 CSS에서 처리)
        const rightMarginPx = 32;

        // 우하단 위치 계산
        let x = window.innerWidth - currentWidth - rightMarginPx;
        let y = window.innerHeight - currentHeight - 27; // 하단에서 27px 떨어진 위치

        // 화면 경계 내로 제한
        x = Math.max(
          0,
          Math.min(x, window.innerWidth - currentWidth - rightMarginPx)
        );
        y = Math.max(0, Math.min(y, window.innerHeight - currentHeight));

        setPosition({ x, y });
      };

      // 즉시 실행
      updateSizeAndPosition();

      // 약간의 지연 후 다시 실행 (DOM이 완전히 렌더링된 후)
      const timeoutId = setTimeout(updateSizeAndPosition, 100);

      // 화면 크기 변경 시에도 위치 재계산
      window.addEventListener("resize", updateSizeAndPosition);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", updateSizeAndPosition);
      };
    }
  }, [isOpen, getModalSize]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent
        ref={modalRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: "default",
        }}
      >
        <ModalHeader>
          <ModalTitle>Result</ModalTitle>
          <HeaderButtons>
            <ExpandButton onClick={onExpand}>
              <ExpandIcon src={ExpandIconImg} />
            </ExpandButton>
            <CloseButton onClick={onClose}>
              <CloseIcon src={CloseIconImg} />
            </CloseButton>
          </HeaderButtons>
        </ModalHeader>
        <ModalBody>
          {/* 이미지 영역 */}
          <ImageContainer>
            <PlaceholderImage />
            <LoadingText>이미지 생성중...</LoadingText>
          </ImageContainer>

          {/* History 섹션 */}
          <HistorySection>
            <HistoryTitle>History</HistoryTitle>
            <HistoryCount>(1/10)</HistoryCount>
          </HistorySection>

          {/* History 항목 */}
          <HistoryItem></HistoryItem>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 1000;
  pointer-events: none; /* 오버레이는 클릭 이벤트를 차단하지 않음 */
`;

const ExpandIcon = styled.img`
  width: 1.5rem;
  height: auto;
`;

const CloseIcon = styled.img`
  width: 1.5rem;
  height: auto;
`;

const ModalContent = styled.div`
  /* rem 단위 사용 - index.css의 font-size 미디어 쿼리에 따라 자동으로 조절됨 */
  width: 33.4375rem; /* 535px @ 16px, 502px @ 15px, 468px @ 14px 등 자동 조절 */
  height: 41.5625rem; /* 665px @ 16px, 624px @ 15px, 582px @ 14px 등 자동 조절 */
  background-color: #ffffff;
  border: 0.0625rem solid #49d8ff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
  pointer-events: auto; /* 모달 콘텐츠는 클릭 가능 */
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem;
`;

const ModalTitle = styled.h2`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4375rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.125rem;
`;

const ExpandButton = styled.button`
  width: 1.5rem;
  height: auto;
  background: none;
  border: none;
  cursor: pointer;
`;

const CloseButton = styled.button`
  width: 1.5rem;
  background: none;
  border: none;
  height: auto;
  cursor: pointer;
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 24.8125rem;
  border-radius: 0.925rem;
  background-color: #f2f2f2;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  border-radius: 0.925rem;
`;

const LoadingText = styled.p`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.214rem;
  font-weight: 400;
  color: #848484;
  margin: 0;
`;

const HistorySection = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const HistoryTitle = styled.h3`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.375rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const HistoryCount = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #848484;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.3875rem 2.53125rem;
  background-color: #f9f9f9;
  border-radius: 0.17375rem;
  height: 2.775rem;
`;
