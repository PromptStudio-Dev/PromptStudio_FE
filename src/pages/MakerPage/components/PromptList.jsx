import React from "react";
import styled from "styled-components";

function PromptList({ prompts, onSelectPrompt }) {
  return (
    <ListWrapper>
      {prompts && prompts.length > 0 ? (
        prompts.map((prompt, index) => (
          <PromptItem key={index} onClick={() => onSelectPrompt?.(prompt)}>
            <PromptTitle>{prompt.title || "제목 없음"}</PromptTitle>
            <PromptPreview>
              {prompt.content
                ? prompt.content.substring(0, 50) +
                  (prompt.content.length > 50 ? "..." : "")
                : "내용 없음"}
            </PromptPreview>
            <PromptMeta>
              {prompt.model && <ModelBadge>{prompt.model}</ModelBadge>}
              {prompt.createdAt && <DateText>{prompt.createdAt}</DateText>}
            </PromptMeta>
          </PromptItem>
        ))
      ) : (
        <EmptyState>저장된 프롬프트가 없습니다</EmptyState>
      )}
    </ListWrapper>
  );
}

export default PromptList;

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2vh 1.5vw;
`;

const PromptItem = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e1e1e1;

  &:hover {
    background-color: #f8f8f8;
    border-color: #00aeff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const PromptTitle = styled.h3`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.19rem;
  font-weight: 600;
  color: #001e40;
  margin: 0 0 0.5rem 0;
`;

const PromptPreview = styled.p`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #848484;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const PromptMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModelBadge = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.81rem;
  font-weight: 600;
  color: #00aeff;
  background-color: rgba(0, 174, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
`;

const DateText = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.81rem;
  font-weight: 400;
  color: #bcbcbc;
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.19rem;
  color: #bcbcbc;
`;
