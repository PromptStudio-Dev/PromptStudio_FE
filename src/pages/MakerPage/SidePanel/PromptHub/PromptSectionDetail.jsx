import React from "react";
import styled from "styled-components";
import PromptCard from "./PromptCard";
import backButtonIcon from "../../assets/side-panel-close.svg";

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
