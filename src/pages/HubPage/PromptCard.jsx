import React, { useState } from "react";
import styled from "styled-components";
import heartIcon from "./assets/heartIcon.svg";
import colorHeartIcon from "./assets/colorHeartIcon.svg";
import copyIcon from "./assets/copyIcon.svg";

export default function PromptCard({
  // promptID = "",
  category = "default",
  aiName = "default",
  title = "default 제목",
  subtitle = "defaultsubtitlesdfsdfdsfdssdfdfsfdsjkfsjfsdsdfjlkdsfjklsdfjsflsjdkfljfsklfjdsflksjlfssfjslskf",
  backgroundImage = "",
  draggable = false,
  onDragStart,
  onDragEnd,
}) {
  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const handleHeartClick = () => {
    setIsHeartClicked((prev) => !prev);
  };

  return (
    <PromptCardContainer
      backgroundImage={backgroundImage}
      draggable={draggable}
      $isDraggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <CardHeader>
        <CategoryTag>{category}</CategoryTag>
        <PromptAiName>{aiName}</PromptAiName>
      </CardHeader>
      <CardTitle $hasBackgroundImage={!!backgroundImage}>{title}</CardTitle>
      <CardSubTitle $hasBackgroundImage={!!backgroundImage}>
        {subtitle}
      </CardSubTitle>
      <ButtonSection>
        <HeartIcon
          src={isHeartClicked ? colorHeartIcon : heartIcon}
          onClick={handleHeartClick}
        />
        <CopyIcon src={copyIcon} />
      </ButtonSection>
    </PromptCardContainer>
  );
}

const HeartIcon = styled.img`
  width: 1.75rem;
  height: 1.75rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const CopyIcon = styled.img`
  width: 1.75rem;
  height: 1.75rem;
  margin-left: 0.37rem;
`;

const ButtonSection = styled.div`
  display: flex;
  margin-top: auto;
  justify-content: flex-end;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
`;

const PromptAiName = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 5.8rem;
  height: 1.4rem;
  padding: 0.12rem 0rem 0.12rem 0.5rem;
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 600;
  color: var(--B-Blue-line, #00aeff);
  text-align: center;
`;

const PromptCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1.56rem;
  width: calc((100% - 4rem) / 3);
  aspect-ratio: 2/1;
  background-color: pink;
  border-radius: 1rem;
  position: relative;
  background: ${({ backgroundImage }) =>
    backgroundImage
      ? `url(${backgroundImage}) center / cover no-repeat`
      : `linear-gradient(
          102deg,
          #e4f7ff 32.44%,
          rgba(175, 225, 255, 0.8) 86.93%,
          rgba(115, 186, 236, 0.8) 109.05%
        )`};
  cursor: ${({ $isDraggable }) => ($isDraggable ? "grab" : "default")};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ backgroundImage }) =>
      backgroundImage ? "rgba(0, 0, 0, 0.5)" : "transparent"};
    border-radius: 1rem;
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const CategoryTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 0.5rem;
  width: 4.5rem;
  height: 1.4rem;
  font-size: 1rem;
  background-color: white;
`;

const CardTitle = styled.p`
  width: 100%;
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 0.69rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#ffffff" : "#000000"};
`;

const CardSubTitle = styled.p`
  width: 100%;
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0.1rem;
  flex: 1;
  min-height: 0;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.4;
  max-height: calc(1rem * 1.4 * 2);
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#ffffff" : "#000000"};
`;
