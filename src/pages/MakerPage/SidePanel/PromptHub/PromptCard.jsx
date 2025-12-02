import React from "react";
import styled from "styled-components";
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
        <CopyIcon src={copyIcon} onClick={handleCopyClick} />
      </ButtonSection>
    </PromptCardContainer>
  );
}

const CopyIcon = styled.img`
  width: 1.75rem;
  height: 1.75rem;
  margin-left: 0.37rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
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
  padding: 0.94rem 1.56rem;
  width: 18rem;
  height: 10rem;
  aspect-ratio: 2/1;
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  background: ${({ backgroundImage }) =>
    backgroundImage
      ? `url(${backgroundImage}) center / cover no-repeat`
      : `#DBF5FF`};
  cursor: pointer;
  outline: none;

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
  font-style: normal;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.5rem;
  height: 1.4rem;
  font-size: 1rem;
  background-color: white;
`;

const CardTitle = styled.p`
  width: 100%;
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  margin-top: 0.69rem;
  margin-left: 0.37rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#ffffff" : "#000000"};
`;

const CardSubTitle = styled.p`
  width: 100%;
  font-size: 0.9rem;
  font-weight: 400;
  margin-top: 0.1rem;
  margin-left: 0.37rem;
  flex: 1;
  min-height: 0;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.2;
  max-height: 2.4em;
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#ffffff" : "#000000"};
`;
