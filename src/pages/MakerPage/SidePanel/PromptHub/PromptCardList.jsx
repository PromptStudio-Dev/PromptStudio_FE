import React, { useRef } from "react";
import styled from "styled-components";
import PromptCard from "./PromptCard";
import moreButtonIcon from "../../assets/card-slider-more-button.svg";
import prevButtonIcon from "../../assets/card-slider-prev-button.svg";

const normalizePrompt = (prompt) => {
  const id =
    prompt?.id ??
    prompt?.promptId ??
    prompt?.promptID ??
    prompt?.prompt_id ??
    "";
  const category = prompt?.category ?? "미분류";
  const aiName = prompt?.aiName ?? prompt?.aiEnvironment ?? "AI";
  const title = prompt?.title ?? "제목 미상";
  const subtitle =
    prompt?.subtitle ?? prompt?.introduction ?? prompt?.description ?? "";
  const backgroundImage = prompt?.backgroundImage ?? prompt?.imageUrl ?? "";

  return {
    id,
    category,
    aiName,
    title,
    subtitle,
    backgroundImage,
    raw: prompt,
  };
};

export default function PromptCardList({ prompts = [], onCardClick }) {
  const listWrapperRef = useRef(null);

  const handleScrollLeft = () => {
    if (listWrapperRef.current) {
      const scrollAmount = 250;

      listWrapperRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (listWrapperRef.current) {
      const scrollAmount = 350;

      listWrapperRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <ListContainer>
      <ListWrapper ref={listWrapperRef}>
        {prompts.length > 0 ? (
          prompts.map((prompt) => {
            const normalized = normalizePrompt(prompt);
            return (
              <PromptCard
                key={normalized.id || Math.random().toString(36)}
                category={normalized.category}
                aiName={normalized.aiName}
                title={normalized.title}
                subtitle={normalized.subtitle}
                backgroundImage={normalized.backgroundImage}
                onClick={() =>
                  onCardClick?.(
                    normalized.id ||
                      normalized.raw?.promptId ||
                      normalized.raw?.id
                  )
                }
              />
            );
          })
        ) : (
          <EmptyMessage>프롬프트가 없습니다.</EmptyMessage>
        )}
      </ListWrapper>
      {prompts.length > 0 && (
        <>
          <PrevButton onClick={handleScrollLeft}>
            <img src={prevButtonIcon} alt="이전" />
          </PrevButton>
          <NextButton onClick={handleScrollRight}>
            <img src={moreButtonIcon} alt="다음" />
          </NextButton>
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
  overflow-x: hidden;
  overflow-y: hidden;
  padding-bottom: 0.2rem;
  scroll-behavior: smooth;
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
