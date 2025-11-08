import React, { useState } from "react";
import styled from "styled-components";
import heartIcon from "../../assets/heartIcon.svg";
import colorHeartIcon from "../../assets/colorHeartIcon.svg";
import copyIcon from "../../assets/copyIcon.svg";

export default function PromptCard({
  // promptID = "",
  category = "default",
  aiName = "default",
  title = "default 제목",
  subtitle = "defaultsubtitlesdfsdfdsfdssdfdfsfdsjkfsjfsdsdfjlkdsfjklsdfjsflsjdkfljfsklfjdsflksjlfssfjslskf",
  backgroundImage = "",
  onClick,
}) {
  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const handleHeartClick = (event) => {
    event.stopPropagation();
    setIsHeartClicked((prev) => !prev);
  };

  const handleCopyClick = (event) => {
    event.stopPropagation();
    console.log("복사 버튼 클릭");
  };

  const hasBackgroundImage = !!backgroundImage;

  return (
    <PromptCardContainer
      backgroundImage={backgroundImage}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <CardHeader>
        <CategoryTag>{category}</CategoryTag>
        <PromptAiName>{aiName}</PromptAiName>
      </CardHeader>
      <CardTitle $hasBackgroundImage={hasBackgroundImage}>{title}</CardTitle>
      <CardSubTitle $hasBackgroundImage={hasBackgroundImage}>
        {subtitle}
      </CardSubTitle>
      <ButtonSection>
        <HeartIcon
          src={isHeartClicked ? colorHeartIcon : heartIcon}
          onClick={handleHeartClick}
        />
        <CopyIcon src={copyIcon} onClick={handleCopyClick} />
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
  cursor: pointer;
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
  justify-content: center;
  padding: 0.94rem 1.19rem;
  width: 18rem;
  height: 10rem;
  aspect-ratio: 2 / 1;
  border-radius: 1rem;
  background: ${({ backgroundImage }) =>
    backgroundImage
      ? `url(${backgroundImage}) center / cover no-repeat`
      : `#dbf5ff;`};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  outline: none;

  &:hover {
    transform: translateY(4px);
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.08);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 174, 255, 0.4);
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
  font-size: 1.25rem; /* 20px */
  font-style: normal;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#fff" : "#000"};
`;

const CardSubTitle = styled.p`
  width: 100%;
  font-size: 0.9rem;
  font-weight: 400;
  margin-top: 0.1rem;
  flex: 1;
  min-height: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.4;
  max-height: calc(1rem * 1.4 * 2);
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#fff" : "#000"};
`;
