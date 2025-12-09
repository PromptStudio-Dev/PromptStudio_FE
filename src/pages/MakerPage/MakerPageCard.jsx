import React, { useState } from "react";
import styled from "styled-components";
import DeleteButtonIcon from "./assets/maker-delete-button.svg";

export default function MakerPageCard({
  title,
  description,
  imageUrl,
  onClick,
  hoverContent, // 호버 시 표시할 내용
  onHover, // 호버 이벤트 핸들러
  onDelete, // 삭제 버튼 클릭 핸들러
}) {
  const [isHovered, setIsHovered] = useState(false);
  const hasBackground = Boolean(imageUrl);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  if (hasBackground) {
    return (
      <ImageCard
        type="button"
        onClick={onClick}
        $backgroundImage={imageUrl}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        $isHovered={isHovered}
      >
        <BackgroundOverlay />
        {isHovered && <HoverBackgroundOverlay />}
        <ImageDescriptionArea>
          <Description $variant="image">{description}</Description>
        </ImageDescriptionArea>
        <ImageFooter>
          <Title $variant="image">{title}</Title>
        </ImageFooter>
        {isHovered && onDelete && (
          <DeleteButton
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="삭제"
          >
            <DeleteButtonIconImg src={DeleteButtonIcon} />
            <DeleteButtonText>삭제</DeleteButtonText>
          </DeleteButton>
        )}
        {isHovered && hoverContent && (
          <HoverOverlay>{hoverContent}</HoverOverlay>
        )}
      </ImageCard>
    );
  }

  return (
    <DefaultCard
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      $isHovered={isHovered}
    >
      {isHovered && <HoverBackgroundOverlay />}
      <DefaultDescriptionArea>
        <Description>{description}</Description>
      </DefaultDescriptionArea>
      <DefaultFooter>
        <Title>{title}</Title>
      </DefaultFooter>
      {isHovered && onDelete && (
        <DeleteButton
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="삭제"
        >
          <DeleteButtonIconImg src={DeleteButtonIcon} />
          <DeleteButtonText>삭제</DeleteButtonText>
        </DeleteButton>
      )}
      {isHovered && hoverContent && <HoverOverlay>{hoverContent}</HoverOverlay>}
    </DefaultCard>
  );
}

const BaseCard = styled.button`
  display: flex;
  flex-direction: column;
  /* width 고정 X, 반응형 가능 구조 */
  width: 100%;
  min-width: 12.25rem;
  max-width: 22.375rem;
  aspect-ratio: 358 / 202; /* Figma 디자인 비율 유지 */
  padding: 0;
  border-radius: 1.1rem;
  border: 0.0625rem solid #49d8ff;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  position: relative;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
  }
`;

// BackgroundOverlay를 ImageCard보다 먼저 선언
const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(9, 23, 43, 0.1) 0%,
    rgba(9, 23, 43, 0.45) 100%
  );
  pointer-events: none;
  z-index: 2;
`;

const HoverBackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.16); /* #00000029 16% 투명도 */
  pointer-events: none;
  z-index: 3;
  transition: opacity 0.15s ease;
`;

const ImageCard = styled(BaseCard)`
  position: relative;
  background: ${({ $backgroundImage }) =>
    `url(${$backgroundImage}) center/cover no-repeat`};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
`;

const DefaultCard = styled(BaseCard)`
  background: #ffffff;
`;

const DescriptionAreaBase = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.45rem 1.12rem;
`;

const ImageDescriptionArea = styled(DescriptionAreaBase)`
  background: transparent;
`;

const DefaultDescriptionArea = styled(DescriptionAreaBase)`
  background-color: #dbf5ff;
`;

const Description = styled.p`
  margin: 0;
  font-size: 1.1875rem;
  line-height: 1.3125rem;
  color: ${({ $variant }) => ($variant === "image" ? "#f4f8ff" : "#4c5a74")};
  text-shadow: ${({ $variant }) =>
    $variant === "image" ? "0 1px 4px rgba(5, 16, 32, 0.45)" : "none"};
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  -webkit-box-pack: start;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: left;
  z-index: 10;
`;

const FooterBase = styled.div`
  padding: 1rem 1.75rem 1.2rem;
`;

const ImageFooter = styled(FooterBase)`
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(10px);
`;

const DefaultFooter = styled(FooterBase)`
  background: #ffffff;
`;

const Title = styled.p`
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 700;
  color: ${({ $variant }) => ($variant === "image" ? "#112138" : "#172441")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: left;
  z-index: 10;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 4.5rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 0.0625rem solid #454545;
  background-color: rgba(255, 255, 255, 0.9);
  color: #ffffff;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, transform 0.15s ease;
  line-height: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
const DeleteButtonIconImg = styled.img`
  width: 1rem;
  height: auto;
`;

const DeleteButtonText = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #454545;
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
  background-color: aquamarine;
  pointer-events: none;
`;
