import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import CopyIcon from "../assets/run-result-text-copy-inactive-icon.svg";
import CopyActiveIcon from "../assets/run-result-text-copy-active-icon.svg";
import SaveIcon from "../assets/run-result-image-save-inactive-icon.svg";
import SaveActiveIcon from "../assets/run-result-image-save-active-icon.svg";
import ExpandIcon from "../assets/run-result-expand-icon.svg";
import CollapseIcon from "../assets/run-result-collapse-icon.svg";
import { downloadHistoryImage } from "../api/results";
import MakerLoadingAnimation from "../assets/Maker Loading.json";

export default function ResultDisplay({
  imageUrl,
  textContent,
  isLoading,
  onExpand,
  isExpanded = false,
  showActions = true, // 버튼 표시 여부 (기본값: true, ResultModal에서는 false)
  makerId = null,
  historyId = null,
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000); // 3초 후 원래 상태로 복귀

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => {
        setIsSaved(false);
      }, 3000); // 3초 후 원래 상태로 복귀

      return () => clearTimeout(timer);
    }
  }, [isSaved]);

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

  // 이미지 저장 로직
  const handleSave = async () => {
    if (!imageUrl || isSaving) return;

    setIsSaving(true);
    setIsSaved(false);

    try {
      let blob;
      let fileName = `image-${Date.now()}.png`;

      // makerId와 historyId가 있으면 백엔드 API를 통해 이미지 다운로드
      if (makerId && historyId) {
        try {
          blob = await downloadHistoryImage(makerId, historyId);
          // 파일명 생성 (이미지 URL에서 확장자 추출)
          const getFileExtension = (imageUrl) => {
            try {
              const urlPath = new URL(imageUrl).pathname;
              const extension = urlPath.split(".").pop()?.toLowerCase();
              if (
                ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension)
              ) {
                return extension;
              }
            } catch {
              // URL 파싱 실패 시 기본값 반환
            }
            return "png"; // 기본 확장자
          };
          const extension = getFileExtension(imageUrl);
          fileName = `image-${Date.now()}.${extension}`;
        } catch (apiError) {
          console.error("이미지 다운로드 실패:", apiError);
          // API 실패 시 기존 imageUrl로 직접 다운로드 시도
          const res = await fetch(imageUrl);
          blob = await res.blob();
        }
      } else {
        // makerId와 historyId가 없으면 기존 방식 (imageUrl 직접 다운로드)
        const res = await fetch(imageUrl);
        blob = await res.blob();
      }

      // Blob을 다운로드
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 메모리 정리
      URL.revokeObjectURL(blobUrl);

      setIsSaved(true);
    } catch (err) {
      console.error("이미지 저장 실패:", err);
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DisplayContainer
      $isExpanded={isExpanded}
      $isLoading={isLoading}
      $isModal={!showActions}
    >
      <ResultSection>
        {isLoading ? (
          <LoadingContainer>
            <LoadingAnimationWrapper $isModal={!showActions}>
              <Lottie animationData={MakerLoadingAnimation} loop={true} />
            </LoadingAnimationWrapper>
            <LoadingTextWrapper>
              <LoadingText>흩어진 프롬프트 파도 모으는 중..</LoadingText>
            </LoadingTextWrapper>
          </LoadingContainer>
        ) : imageUrl ? (
          <ResultImage src={imageUrl} alt="생성된 이미지" />
        ) : textContent ? (
          <TextContent>{textContent}</TextContent>
        ) : (
          <Placeholder />
        )}
      </ResultSection>
      {showActions && !isLoading && (textContent || imageUrl) && (
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
            <SaveButton
              onClick={handleSave}
              $isSaved={isSaved}
              disabled={isSaving}
            >
              <SaveIconImg
                src={isSaved ? SaveActiveIcon : SaveIcon}
                alt="저장"
              />
              <SaveText $isSaved={isSaved}>
                {isSaving ? "저장중..." : "저장"}
              </SaveText>
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
  width: ${(props) => {
    if (props.$isModal) return "100%";
    return props.$isExpanded ? "62rem" : "29.25rem";
  }};
  height: ${(props) => {
    if (props.$isModal) return "100%";
    return props.$isExpanded ? "28.9375rem" : "25.6875rem";
  }};
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
  padding: 0 0.5rem 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
`;

const LoadingAnimationWrapper = styled.div`
  width: ${(props) => (props.$isModal ? "15rem" : "24rem")};
  height: ${(props) => (props.$isModal ? "15rem" : "24rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #49d8ff;
  margin: 0;
`;

const LoadingTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  height: 2.5625rem;
  min-width: 5rem;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
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
  color: ${(props) => (props.$isSaved ? "#00AEFF" : "#848484")};
  transition: color 0.2s ease;
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
