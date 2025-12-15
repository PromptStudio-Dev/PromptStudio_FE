import React from "react";
import styled from "styled-components";

export default function ResultFeedback({ feedbackText }) {
  const text =
    (feedbackText && feedbackText.trim()) ||
    "피드백은 하루 30회까지 요청할 수 있어요.\n내일 다시 시도해주세요!";

  return (
    <FeedbackContainer>
      <FeedbackText>{text}</FeedbackText>
    </FeedbackContainer>
  );
}

const FeedbackContainer = styled.section`
  width: 100%;
  border-radius: 0.5rem;
  background-color: #e0f5ff;
  padding: 1rem;
  box-sizing: border-box;
  display: block; /* 텍스트 길이에 따라 높이 자동 확장 */
  margin-bottom: 8rem;
`;

const FeedbackText = styled.p`
  margin: 0;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
  line-height: 1.625rem;
  letter-spacing: -2.5%;
  color: #000000;
  font-weight: 500;
  white-space: pre-wrap;
`;
