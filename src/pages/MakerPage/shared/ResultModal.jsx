import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ExpandIconImg from "../assets/result-modal-expansion-button.svg";
import CloseIconImg from "../assets/result-modal-close-button.svg";
import ResultDisplay from "./ResultDisplay";
import HistoryBar from "./HistoryBar";
import ResultFeedback from "./ResultFeedback";

export default function ResultModal({
  isOpen,
  onClose,
  onExpand,
  currentHistoryIndex = 3,
  historyItems = [],
  onHistoryItemClick,
  resultImageUrl = null,
  resultText = null,
  isResultLoading = false,
  feedbackText = null,
}) {
  const [activeTab, setActiveTab] = useState("HISTORY"); // "HISTORY" | "FEEDBACK"
  // 모달 크기는 CSS에서 관리하고, JavaScript에서는 실제 렌더링된 크기를 사용
  const modalRef = useRef(null);

  const [position, setPosition] = useState(null);
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 위치 계산 상태 초기화
      setIsPositionCalculated(false);
      // 초기 위치를 임시로 설정 (모달이 렌더링되도록 하기 위해)
      // 실제 위치는 DOM이 마운트된 후 계산됨
      setPosition({ x: 0, y: 0 });

      // 모달이 열릴 때 위치를 확실하게 설정
      const updateSizeAndPosition = () => {
        if (!modalRef.current) return;

        // 실제 렌더링된 크기 가져오기
        const rect = modalRef.current.getBoundingClientRect();
        const currentWidth = rect.width;
        const currentHeight = rect.height;

        // 크기가 0이면 아직 렌더링이 완료되지 않은 것
        if (currentWidth === 0 || currentHeight === 0) {
          return;
        }

        // 오른쪽 여백
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

      // DOM이 완전히 렌더링되고 레이아웃이 안정화된 후 위치 계산
      // requestAnimationFrame을 두 번 사용하여 브라우저가 레이아웃을 완료한 후 실행
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 한 번 더 확인하여 모달이 완전히 렌더링되었는지 확인
          if (modalRef.current) {
            updateSizeAndPosition();
          } else {
            // 아직 마운트되지 않았다면 약간의 지연 후 재시도
            setTimeout(() => {
              if (modalRef.current) {
                updateSizeAndPosition();
              }
            }, 10);
          }
        });
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
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent
        ref={modalRef}
        style={{
          position: "absolute",
          left: `${position?.x ?? 0}px`,
          top: `${position?.y ?? 0}px`,
          cursor: "default",
          visibility: isPositionCalculated ? "visible" : "hidden",
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
          <ContentWrapper>
            <ResultDisplay
              isLoading={isResultLoading}
              imageUrl={resultImageUrl}
              textContent={resultText}
              showActions={false}
            />

            <BottomSection>
              <TabHeader>
                <TabButton
                  type="button"
                  data-active={activeTab === "HISTORY"}
                  onClick={() => setActiveTab("HISTORY")}
                >
                  <TabTitle>History</TabTitle>
                  <TabCount>
                    ({currentHistoryIndex}/{historyItems.length || 0})
                  </TabCount>
                </TabButton>
                <TabButton
                  type="button"
                  data-active={activeTab === "FEEDBACK"}
                  onClick={() => setActiveTab("FEEDBACK")}
                >
                  <TabTitle>Feedback</TabTitle>
                </TabButton>
              </TabHeader>

              <TabContentWrapper>
                {activeTab === "HISTORY" ? (
                  <TabInnerHistory>
                    <HistoryBar
                      currentIndex={currentHistoryIndex}
                      totalCount={historyItems.length || 10}
                      historyItems={historyItems}
                      onItemClick={onHistoryItemClick}
                    />
                  </TabInnerHistory>
                ) : (
                  <TabInnerFeedback>
                    <ResultFeedback feedbackText={feedbackText} />
                  </TabInnerFeedback>
                )}
              </TabContentWrapper>
            </BottomSection>
          </ContentWrapper>
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  flex: 1 0 auto;
  padding: 1.62rem 3rem 1.62rem 2rem;
  flex-direction: column;
  gap: 3rem;
  overflow-y: auto;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 2rem;
`;

const TabContentWrapper = styled.div`
  flex: 0 0 auto; /* 고정 높이 */
  width: 100%;
  min-height: 8rem; /* HISTORY와 FEEDBACK 높이를 동일하게 맞춤 */
  height: 8rem; /* 고정 높이 */
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TabInnerHistory = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const TabInnerFeedback = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 1rem;
`;

const TabHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2rem;
`;

const TabButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: baseline;
  gap: 0.625rem;
  border-bottom: 0.1875rem solid
    ${(props) => (props["data-active"] ? "#21C3FF" : "transparent")};
  color: ${(props) => (props["data-active"] ? "#000000" : "#A6A6A6")};

  &:hover {
    opacity: 0.9;
  }
`;

const TabTitle = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4375rem;
  font-weight: 700;
`;

const TabCount = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #848484;
`;
