import React from "react";
import styled from "styled-components";
import PromptCard from "./PromptCard";

export default function PromptCardList({ prompts = [], onCardClick }) {
  return (
    <ListWrapper>
      {prompts.length > 0 ? (
        prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            category={prompt.category}
            aiName={prompt.aiName}
            title={prompt.title}
            subtitle={prompt.subtitle}
            backgroundImage={prompt.backgroundImage}
            onClick={() => onCardClick?.(prompt.id)}
          />
        ))
      ) : (
        <EmptyMessage>프롬프트가 없습니다.</EmptyMessage>
      )}
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.5rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: #999;
  width: 100%;
`;
