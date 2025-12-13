import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CopyIcon from "../assets/run-result-text-copy-inactive-icon.svg";
import CopyActiveIcon from "../assets/run-result-text-copy-active-icon.svg";
import SaveIcon from "../assets/run-result-image-save-inactive-icon.svg";
import ExpandIcon from "../assets/run-result-expand-icon.svg";
import CollapseIcon from "../assets/run-result-collapse-icon.svg";

export default function ResultDisplay({
  imageUrl,
  textContent,
  isLoading,
  onExpand,
  isExpanded = false,
  showActions = true, // 버튼 표시 여부 (기본값: true, ResultModal에서는 false)
}) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000); // 3초 후 원래 상태로 복귀

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    if (textContent) {
      navigator.clipboard
        .writeText(textContent)
        .then(() => {
          setIsCopied(true);
        })
        .catch((err) => {
          console.error("복사 실패:", err);
        });
    }
  };

  // 백엔드와 상의 후 고쳐야 할 필요가 있음
  // 백엔드에서 S3 CORS 설정 필요
  const handleSave = async () => {
    if (!imageUrl) return;

    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${Date.now()}.png`; // 브라우저가 직접 다운로드 시작
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("다운로드 실패:", err);
    }
  };

  return (
    <DisplayContainer $isExpanded={isExpanded}>
      <ResultSection>
        {imageUrl ? (
          <ResultImage src={imageUrl} alt="생성된 이미지" />
        ) : textContent ? (
          <TextContent>{textContent}</TextContent>
        ) : (
          <Placeholder />
        )}
        {isLoading && <LoadingText>결과 생성중...</LoadingText>}
      </ResultSection>
      {showActions && (textContent || imageUrl) && (
        <ActionButtons>
          {textContent && (
            <CopyButton onClick={handleCopy} $isCopied={isCopied}>
              <CopyIconImg
                src={isCopied ? CopyActiveIcon : CopyIcon}
                alt="복사"
              />
              <CopyText $isCopied={isCopied}>복사</CopyText>
            </CopyButton>
          )}
          {imageUrl && (
            <SaveButton onClick={handleSave}>
              <SaveIconImg src={SaveIcon} alt="저장" />
              <SaveText>저장</SaveText>
            </SaveButton>
          )}
          <ExpandButton onClick={onExpand}>
            <ExpandIconImg
              src={isExpanded ? CollapseIcon : ExpandIcon}
              alt={isExpanded ? "축소" : "확장"}
            />
          </ExpandButton>
        </ActionButtons>
      )}
    </DisplayContainer>
  );
}

const DisplayContainer = styled.div`
  position: relative;
  width: ${(props) => (props.$isExpanded ? "62rem" : "29.25rem")};
  height: ${(props) => (props.$isExpanded ? "28.9375rem" : "25.6875rem")};
  overflow: ${(props) => (props.$isExpanded ? "visible" : "hidden")};
  display: flex;
  flex-direction: column;
  margin: ${(props) =>
    props.$isExpanded ? "0" : "0 auto"}; /* 확장 시 왼쪽 정렬, 기본은 가운데 */
  transition: width 0.3s ease, height 0.3s ease;
  gap: 2rem;
`;

const ResultSection = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: visible;
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
  overflow-x: hidden;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem; /* 19px */
  line-height: 1.625rem; /* 26px */
  letter-spacing: -0.0125rem; /* -0.475px */
  color: #000000;
  box-sizing: border-box;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;

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

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6875rem;
  z-index: 10;
  flex-shrink: 0;
  justify-content: flex-end;
  width: 100%;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.375rem;
  background-color: #f5fcff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  height: 2.5625rem;
  min-width: 5rem;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CopyIconImg = styled.img`
  width: 1.75rem;
  height: 1.75rem;
`;

const CopyText = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: ${(props) => (props.$isCopied ? "#00AEFF" : "#848484")};
  transition: color 0.2s ease;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.375rem;
  background-color: #f5fcff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  height: 2.5625rem;
  min-width: 5rem;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SaveIconImg = styled.img`
  width: 1.75rem;
  height: 1.75rem;
`;

const SaveText = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #848484;
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5625rem;
  background-color: #f5fcff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ExpandIconImg = styled.img`
  width: 1.125rem;
  height: 1.125rem;
`;
