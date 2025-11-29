import React, { forwardRef } from "react";
import styled from "styled-components";
import infoIcon from "../assets/infoIcon.svg";

const DroppedPromptPreview = forwardRef(
  ({ backgroundImage, fixedHeight, onRemove, onEdit, ...props }, ref) => {
    const hasBackgroundImage = !!backgroundImage;

    return (
      <DroppedPromptPreviewContainer
        ref={ref}
        $backgroundImage={backgroundImage}
        $fixedHeight={fixedHeight}
        {...props}
      >
        <PreviewRemoveButton
          type="button"
          aria-label="미리보기 제거"
          onClick={onRemove}
        >
          ✕
        </PreviewRemoveButton>
        <DroppedPromptHeader>
          <DroppedPromptCategory>{props.category}</DroppedPromptCategory>
          <DroppedPromptAiName $hasBackgroundImage={hasBackgroundImage}>
            {props.aiName}
          </DroppedPromptAiName>
        </DroppedPromptHeader>
        <DroppedPromptTitle $hasBackgroundImage={hasBackgroundImage}>
          {props.title}
        </DroppedPromptTitle>
        <DroppedPromptSubtitle $hasBackgroundImage={hasBackgroundImage}>
          {props.subtitle}
        </DroppedPromptSubtitle>
        <PreviewFooter>
          <EditButton type="button" onClick={onEdit}>
            <EditIcon src={infoIcon} alt="수정" />
          </EditButton>
        </PreviewFooter>
      </DroppedPromptPreviewContainer>
    );
  }
);

DroppedPromptPreview.displayName = "DroppedPromptPreview";

export default DroppedPromptPreview;

// 스타일 컴포넌트들
const DroppedPromptPreviewContainer = styled.div`
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 1rem 1.25rem;
  border-radius: 0.9rem;
  background: ${({ $backgroundImage }) =>
    $backgroundImage
      ? `url(${$backgroundImage}) center / cover no-repeat`
      : `linear-gradient(
          102deg,
          #e4f7ff 32.44%,
          rgba(175, 225, 255, 0.8) 86.93%,
          rgba(115, 186, 236, 0.8) 109.05%
        )`};
  box-shadow: 0 0.5rem 1.2rem rgba(0, 30, 64, 0.08);
  color: #001e40;
  pointer-events: auto;
  overflow: visible;
  ${({ $fixedHeight }) =>
    typeof $fixedHeight === "number" && $fixedHeight > 0
      ? `
  height: ${$fixedHeight}px;
  min-height: ${$fixedHeight}px;
  max-height: ${$fixedHeight}px;
  `
      : ""}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ $backgroundImage }) =>
      $backgroundImage ? "rgba(0, 0, 0, 0.5)" : "transparent"};
    border-radius: 0.9rem;
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const PreviewRemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
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

  ${DroppedPromptPreviewContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const DroppedPromptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const DroppedPromptCategory = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.5rem;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.85);
  font-family: "Pretendard";
  font-size: 0.875rem;
  font-weight: 600;
  color: #000000;
`;

const DroppedPromptAiName = styled.span`
  font-family: "Pretendard";
  font-size: 0.8125rem;
  font-weight: 600;
  color: #00aeff;
`;

const DroppedPromptTitle = styled.h3`
  margin: 0 0 0.3rem 0;
  font-family: "Pretendard";
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#ffffff" : "#001e40"};
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DroppedPromptSubtitle = styled.p`
  margin: 0;
  font-family: "Pretendard";
  font-size: 0.925rem;
  line-height: 1.45;
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#ffffff" : "#233243"};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: calc(0.925rem * 1.45 * 2);
`;

const PreviewFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const EditIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;
