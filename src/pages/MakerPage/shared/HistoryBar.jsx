import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import historyUpButton from "../assets/historybar-up-button.svg";
import historyDownButton from "../assets/historybar-down-button.svg";

export default function HistoryBar({
  currentIndex = 1,
  historyItems = [],
  onItemClick,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const hasScrollableContent = historyItems.length >= 4;

  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current || !hasScrollableContent) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
  }, [hasScrollableContent]);

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      return () => {
        container.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [checkScrollability]);

  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      const itemHeight = 3 + 2.375; // 3rem + 2.375rem gap
      scrollContainerRef.current.scrollBy({
        top: -itemHeight * 16,
        behavior: "smooth",
      });
    }
  };

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      const itemHeight = 3 + 2.375; // 3rem + 2.375rem gap
      scrollContainerRef.current.scrollBy({
        top: itemHeight * 16,
        behavior: "smooth",
      });
    }
  };

  return (
    <HistoryContainer>
      {historyItems.length > 0 ? (
        <HistoryListWrapper>
          <ScrollableArea
            ref={scrollContainerRef}
            $hasScrollableContent={hasScrollableContent}
          >
            {hasScrollableContent && <TopBlurOverlay />}
            <TimelineContainer>
              <TimelineLine $itemCount={historyItems.length || 1} />
              {historyItems.map((item, index) => (
                <TimelineDot
                  key={`dot-${item.id || index}`}
                  $isActive={index === currentIndex - 1}
                  $index={index}
                />
              ))}
            </TimelineContainer>
            <HistoryList>
              {historyItems.map((item, index) => (
                <HistoryItem
                  key={item.id || index}
                  onClick={() => onItemClick && onItemClick(item, index)}
                  $isActive={index === currentIndex - 1}
                >
                  <HistoryItemTitle>{item.title || ""}</HistoryItemTitle>
                  <HistoryItemMeta>
                    {item.status || item.time || ""}
                  </HistoryItemMeta>
                </HistoryItem>
              ))}
            </HistoryList>
          </ScrollableArea>
          {hasScrollableContent && (
            <ScrollButtons>
              <ScrollButton
                onClick={handleScrollUp}
                disabled={!canScrollUp}
                $isUp
              >
                <ScrollButtonImg src={historyUpButton} alt="위로 스크롤" />
              </ScrollButton>
              <ScrollButton
                onClick={handleScrollDown}
                disabled={!canScrollDown}
                $isUp={false}
              >
                <ScrollButtonImg src={historyDownButton} alt="아래로 스크롤" />
              </ScrollButton>
            </ScrollButtons>
          )}
        </HistoryListWrapper>
      ) : (
        <EmptyState>히스토리가 없습니다</EmptyState>
      )}
    </HistoryContainer>
  );
}

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
`;

const HistoryListWrapper = styled.div`
  display: flex;
  position: relative;
  margin-left: 0;
`;

const ScrollableArea = styled.div`
  position: relative;
  overflow-y: ${(props) => (props.$hasScrollableContent ? "auto" : "visible")};
  overflow-x: hidden;
  min-height: 18rem; /* 항목 수와 무관하게 세로선이 영역 전체를 차지하도록 */
  /* 4개부터 스크롤: 4개 높이(≈19.125rem)까지만 보여주고 넘치면 스크롤 */
  max-height: ${(props) =>
    props.$hasScrollableContent
      ? "calc((3rem + 2.375rem) * 3 + 3rem)"
      : "18rem"};
  margin-left: 0;
  width: 100%;
  scroll-behavior: smooth;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const TopBlurOverlay = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 3.125rem;
  background-color: #ffffff;
  filter: blur(2rem);
  z-index: 10;
  pointer-events: none;
  margin-bottom: -3.125rem;
`;

const ScrollButtonImg = styled.img`
  width: 1.875rem; /* 30px */
  height: 1.875rem; /* 30px */
`;

const ScrollButtons = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  z-index: 20;
  margin-right: -2rem;
`;

const ScrollButton = styled.button`
  width: 1.875rem;
  height: 1.875rem;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: opacity 0.2s ease;
  padding: 0;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:active:not(:disabled) {
    opacity: 0.6;
  }

  &:disabled {
    opacity: 0.3;
  }
`;

const TimelineContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1.625rem; /* 26px */
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 0.125rem; /* 2px */
  height: ${(props) => {
    const itemHeight = 3; // 3rem
    const gap = 2.375; // 2.375rem
    const count = props.$itemCount || 1;
    const calcHeight = (itemHeight + gap) * (count - 1) + itemHeight;
    const minHeight = 18; // rem
    return `max(${calcHeight}rem, ${minHeight}rem)`; // 아이템 높이 vs 최소 높이 중 큰 값
  }};
  background-color: #49d8ff;
  z-index: 0;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  top: ${(props) => {
    const itemHeight = 3; // 3rem
    const gap = 2.375; // 2.375rem
    const index = props.$index || 0;
    return `${(itemHeight + gap) * index + itemHeight / 2}rem`;
  }};
  transform: translate(-50%, -50%);
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  background-color: ${(props) => (props.$isActive ? "#49d8ff" : "#FFFFFF")};
  border: ${(props) => (props.$isActive ? "none" : "0.1875rem solid #49d8ff")};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: top 0.35s ease, background-color 0.25s ease, border 0.25s ease;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.375rem;
  margin-left: 2.5rem;
  width: 27.375rem;
  min-height: 18rem; /* 라인 높이와 기본 영역 맞추기 */
`;

const HistoryItem = styled.div`
  position: relative;
  min-height: 3rem;
  height: 3rem;
  border-radius: 0.1875rem;
  background-color: ${(props) => (props.$isActive ? "#e8faff" : "transparent")};
  padding: 0 0.9375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#d4e8f0" : "#f5f5f5")};
  }
`;

const HistoryItemTitle = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem; /* 19px */
  font-weight: 500;
  color: #000000;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

const HistoryItemMeta = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 500;
  color: #848484;
  line-height: 1.2;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
`;

const EmptyState = styled.div`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  color: #848484;
  text-align: center;
  padding: 2rem 0;
`;
