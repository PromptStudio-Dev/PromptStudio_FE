import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import PromptCard from "./PromptCard";
import moreButtonIcon from "../../assets/card-slider-more-button.svg";
import prevButtonIcon from "../../assets/card-slider-prev-button.svg";

export default function PromptCardList({ prompts = [], onCardClick }) {
  const listWrapperRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (!listWrapperRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = listWrapperRef.current;
    const isAtStart = scrollLeft <= 5; // 5px tolerance
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // 5px tolerance

    setCanScrollLeft(!isAtStart);
    setCanScrollRight(!isAtEnd);
  };

  useEffect(() => {
    checkScrollability();

    const element = listWrapperRef.current;
    if (!element) return;

    // 스크롤 이벤트에 디바운싱 적용
    // 스크롤 이벤트 리스너 - 실시간 감지
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        checkScrollability();
      }, 50);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkScrollability);

    // 초기 체크를 위해 약간의 지연 후 다시 확인
    const timeoutId = setTimeout(checkScrollability, 100);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScrollability);
      clearTimeout(timeoutId);
      clearTimeout(scrollTimeout);
    };
  }, [prompts]);

  const handleScrollLeft = () => {
    if (listWrapperRef.current) {
      const scrollAmount = 250;

      listWrapperRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });

      // 스크롤 완료 후 상태 업데이트
      setTimeout(() => {
        checkScrollability();
      }, 300);
    }
  };

  const handleScrollRight = () => {
    if (listWrapperRef.current) {
      const scrollAmount = 350;

      listWrapperRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // 스크롤 완료 후 상태 업데이트
      setTimeout(() => {
        checkScrollability();
      }, 300);
    }
  };

  return (
    <ListContainer>
      <ListWrapper ref={listWrapperRef}>
        {prompts.length > 0 ? (
          prompts.map((prompt) => (
            <PromptCard
              key={prompt.promptId ?? prompt.id}
              promptId={prompt.promptId ?? prompt.id ?? prompt.ID}
              category={prompt.category}
              aiName={prompt.aiEnvironment}
              title={prompt.title}
              subtitle={prompt.introduction}
              backgroundImage={prompt.imageUrl}
              onClick={() =>
                onCardClick?.(prompt.promptId ?? prompt.id ?? prompt.ID)
              }
            />
          ))
        ) : (
          <EmptyMessage>프롬프트가 없습니다.</EmptyMessage>
        )}
      </ListWrapper>
      {prompts.length > 0 && (
        <>
          {canScrollLeft && (
            <PrevButton onClick={handleScrollLeft}>
              <img src={prevButtonIcon} alt="이전" />
            </PrevButton>
          )}
          {canScrollRight && (
            <NextButton onClick={handleScrollRight}>
              <img src={moreButtonIcon} alt="다음" />
            </NextButton>
          )}
        </>
      )}
    </ListContainer>
  );
}

const ListContainer = styled.div`
  position: relative;

  &:hover button {
    opacity: 1;
    visibility: visible;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.2rem;
  scroll-behavior: smooth;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: #999;
  width: 100%;
`;

const PrevButton = styled.button`
  position: absolute;
  left: -1rem;
  top: 50%;
  transform: translateY(-50%);
  width: auto;
  height: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;
  padding: 0;

  img {
    height: 2.25rem; /* 카드 높이와 동일 */
    width: auto;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:active img {
    transform: scale(0.98);
  }
`;

const NextButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: auto;
  height: auto;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;
  padding: 0;

  img {
    height: 10.375rem; /* 카드 높이와 동일 */
    width: auto;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:active img {
    transform: scale(0.98);
  }
`;
