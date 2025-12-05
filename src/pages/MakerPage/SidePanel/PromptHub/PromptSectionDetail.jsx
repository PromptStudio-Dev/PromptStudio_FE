import React from "react";
import styled from "styled-components";
import PromptCard from "./PromptCard";
import backButtonIcon from "../../assets/side-panel-close.svg";

export default function PromptSectionDetail({
  sectionTitle,
  prompts = [],
  onCardClick,
  onBack,
}) {
  return (
    <Wrapper>
      <Header>
        <BackButton onClick={onBack}>
          <img src={backButtonIcon} alt="뒤로" />
        </BackButton>
        <Title>{sectionTitle}</Title>
      </Header>
      <ContentArea>
        <CardList>
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
        </CardList>
      </ContentArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.77vw 1rem 1.77vw;
`;

const BackButton = styled.button`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #666666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #000000;
  }
`;

const Title = styled.h2`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.88rem;
  width: 100%;
  overflow-y: auto;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: #999;
  grid-column: 1 / -1;
`;
