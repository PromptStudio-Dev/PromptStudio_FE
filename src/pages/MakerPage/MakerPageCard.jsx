import React from "react";
import styled from "styled-components";

export default function MakerPageCard({
  title,
  description,
  imageUrl,
  onClick,
}) {
  const hasBackground = Boolean(imageUrl);

  if (hasBackground) {
    return (
      <ImageCard type="button" onClick={onClick} $backgroundImage={imageUrl}>
        <BackgroundOverlay />
        <ImageDescriptionArea>
          <Description $variant="image">{description}</Description>
        </ImageDescriptionArea>
        <ImageFooter>
          <Title $variant="image">{title}</Title>
        </ImageFooter>
      </ImageCard>
    );
  }

  return (
    <DefaultCard type="button" onClick={onClick}>
      <DefaultDescriptionArea>
        <Description>{description}</Description>
      </DefaultDescriptionArea>
      <DefaultFooter>
        <Title>{title}</Title>
      </DefaultFooter>
    </DefaultCard>
  );
}

const BaseCard = styled.button`
  display: flex;
  flex-direction: column;
  width: 22.375rem;
  height: 12.625rem;
  padding: 0;
  border-radius: 1.1rem;
  border: 2px solid #5ac1ff;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

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
  z-index: 0;
`;

const ImageCard = styled(BaseCard)`
  position: relative;
  background: ${({ $backgroundImage }) =>
    `url(${$backgroundImage}) center/cover no-repeat`};

  & > *:not(${BackgroundOverlay}) {
    position: relative;
    z-index: 1;
  }
`;

const DefaultCard = styled(BaseCard)`
  background: #ffffff;
`;

const DescriptionAreaBase = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: center;
  padding: 1.45rem 1.75rem;
`;

const ImageDescriptionArea = styled(DescriptionAreaBase)`
  background: transparent;
`;

const DefaultDescriptionArea = styled(DescriptionAreaBase)`
  background-color: #dbf5ff;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.6;
  color: ${({ $variant }) => ($variant === "image" ? "#f4f8ff" : "#4c5a74")};
  text-shadow: ${({ $variant }) =>
    $variant === "image" ? "0 1px 4px rgba(5, 16, 32, 0.45)" : "none"};
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
  font-size: 1.03rem;
  font-weight: 700;
  color: ${({ $variant }) => ($variant === "image" ? "#112138" : "#172441")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
