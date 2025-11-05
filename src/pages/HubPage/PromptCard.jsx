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
}) {
  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const handleHeartClick = () => {
    setIsHeartClicked((prev) => !prev);
  };

  return (
    <PromptCardContainer backgroundImage={backgroundImage}>
      <CardHeader>
        <CategoryTag>{category}</CategoryTag>
        <PromptAiName>{aiName}</PromptAiName>
      </CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardSubTitle>{subtitle}</CardSubTitle>
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
  margin-top: 0.3rem;
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
  width: 17.03125vw;
  aspect-ratio: 2 / 1;
  background-color: pink;
  border-radius: 1rem;
  background: ${({ backgroundImage }) =>
    backgroundImage
      ? `url(${backgroundImage}) center / cover no-repeat`
      : `linear-gradient(
          102deg,
          #e4f7ff 32.44%,
          rgba(175, 225, 255, 0.8) 86.93%,
          rgba(115, 186, 236, 0.8) 109.05%
        )`};
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
  height: 1.1875rem;
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const CardSubTitle = styled.p`
  width: 100%;
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0.5rem;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
