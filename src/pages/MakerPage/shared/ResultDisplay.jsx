import React from "react";
import styled from "styled-components";

export default function ResultDisplay({ imageUrl, textContent, isLoading }) {
  return (
    <DisplayContainer>
      {imageUrl ? (
        <ResultImage src={imageUrl} alt="생성된 이미지" />
      ) : textContent ? (
        <TextContent>{textContent}</TextContent>
      ) : (
        <Placeholder />
      )}
      {isLoading && <LoadingText>이미지 생성중...</LoadingText>}
    </DisplayContainer>
  );
}

const DisplayContainer = styled.div`
  position: relative;
  width: 29.25rem;
  height: 25.6875rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  border-radius: 0.925rem;
`;

const ResultImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.925rem;
`;

const TextContent = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.25rem;
  line-height: 1.625rem;
  letter-spacing: 0;
  color: #000000;
  box-sizing: border-box;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
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
