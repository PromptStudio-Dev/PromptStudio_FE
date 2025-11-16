import React, { forwardRef } from "react";
import styled from "styled-components";

const AttachedImagesPreview = forwardRef(
  (
    {
      attachedImages,
      hasDroppedPrompt,
      imageCount,
      isHidden,
      onImageRemove,
      ...props
    },
    ref
  ) => {
    return (
      <AttachedImagesPreviewContainer
        ref={ref}
        $hasDroppedPrompt={hasDroppedPrompt}
        $imageCount={imageCount}
        $isHidden={isHidden}
        {...props}
      >
        {attachedImages.map((image) => (
          <ImagePreviewItem key={image.id}>
            <ImagePreviewRemoveButton
              type="button"
              aria-label="이미지 제거"
              onClick={() => onImageRemove(image.id)}
            >
              ✕
            </ImagePreviewRemoveButton>
            <ImagePreview src={image.preview} alt="첨부된 이미지" />
          </ImagePreviewItem>
        ))}
      </AttachedImagesPreviewContainer>
    );
  }
);

AttachedImagesPreview.displayName = "AttachedImagesPreview";

export default AttachedImagesPreview;

// 스타일 컴포넌트들
const AttachedImagesPreviewContainer = styled.div`
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: ${({ $hasDroppedPrompt }) => {
    if (!$hasDroppedPrompt) return "0";
    return "calc(min(50%, 26rem) + 0.75rem)";
  }};
  width: ${({ $hasDroppedPrompt }) => {
    // 프롬프트 카드가 있으면 줄임, 없으면 100%
    if ($hasDroppedPrompt) return "min(50%, 26rem)";
    return "100%";
  }};
  display: ${({ $isHidden }) => ($isHidden ? "none" : "grid")};
  gap: 0.5rem;
  padding: 0;
  pointer-events: auto;
  align-content: start;
  overflow-y: auto;
  box-sizing: border-box;
  justify-content: start;
  align-items: start;
  grid-auto-flow: row;
  grid-template-rows: var(--grid-template-rows, auto);
  grid-auto-rows: 0;
  grid-template-columns: var(--grid-template-columns, auto);
`;

const ImagePreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f5f5f5;
  width: var(--image-size, auto);
  height: var(--image-size, auto);
  max-height: var(--image-size, none);
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePreviewRemoveButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;

  ${ImagePreviewItem}:hover & {
    opacity: 1;
  }
`;
