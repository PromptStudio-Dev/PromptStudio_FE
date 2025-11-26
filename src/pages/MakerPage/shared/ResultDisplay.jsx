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
  width: 27.3125rem; /* 437px - Figma 디자인 기준 */
  height: 26.3125rem; /* 421px - Figma 디자인 기준 */
  border-radius: 0.925rem;
  background-color: #f2f2f2;
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
  padding: 1.5rem;
  overflow-y: auto;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.0625rem; /* 17px */
  line-height: 1.35;
  color: #000000;
  letter-spacing: -0.425px;
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
