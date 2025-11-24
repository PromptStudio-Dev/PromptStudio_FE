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

  const [position, setPosition] = useState(null);
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 위치 계산 상태 초기화
      setIsPositionCalculated(false);
      // 초기 위치를 설정하여 즉시 렌더링할 수 있도록 함
      const initialSize = getModalSize();
      const rightMarginPx = 32;
      const initialX = window.innerWidth - initialSize.width - rightMarginPx;
      const initialY = window.innerHeight - initialSize.height - 27;
      setPosition({
        x: Math.max(
          0,
          Math.min(
            initialX,
            window.innerWidth - initialSize.width - rightMarginPx
          )
        ),
        y: Math.max(
          0,
          Math.min(initialY, window.innerHeight - initialSize.height)
        ),
      });

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
        setIsPositionCalculated(true);
      };

      // DOM이 완전히 렌더링된 후 한 번만 실행
      requestAnimationFrame(() => {
        requestAnimationFrame(updateSizeAndPosition);
      });

      // 화면 크기 변경 시에도 위치 재계산
      window.addEventListener("resize", updateSizeAndPosition);

      return () => {
        window.removeEventListener("resize", updateSizeAndPosition);
      };
    } else {
      // 모달이 닫힐 때 상태 초기화
      setPosition(null);
      setIsPositionCalculated(false);
    }
  }, [isOpen, getModalSize]);

  if (!isOpen || !position) return null;

  return (
    <ModalOverlay>
      <ModalContent
        ref={modalRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: "default",
          opacity: isPositionCalculated ? 1 : 0,
          transition: isPositionCalculated ? "opacity 0.1s ease-in" : "none",
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
