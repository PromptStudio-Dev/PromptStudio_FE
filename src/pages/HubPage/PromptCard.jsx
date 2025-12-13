import React, { useEffect, useState } from "react";
import styled from "styled-components";
import heartIcon from "./assets/heartIcon.svg";
import colorHeartIcon from "./assets/colorHeartIcon.svg";
import copyIcon from "./assets/copyIcon.svg";
import copyCompleteIcon from "./assets/copyCompleteIcon.svg";

import apiClient from "../../api/client";
import { isLoggedIn } from "../../utils/authStorage";
import { useLoginModal } from "../../contexts/LoginModalContext";
import { useCopyModal } from "../../contexts/CopyModalContext";

export default function PromptCard({
  promptId = "", // promptID가 필요하므로 기본값 설정
  category = "default",
  aiName = "default",
  title = "default 제목",
  subtitle = "defaultsubtitlesdfsdfdsfdssdfdfsfdsjkfsjfsdsdfjlkdsfjklsdfjsflsjdkfljfsklfjdsflksjlfssfjslskf",
  backgroundImage = "",
  draggable = false,
  onDragStart,
  onDragEnd,
  initialLiked = false,
  onClick,
  onHeartToggle,
  heartIconSrc = heartIcon,
  heartSelectedIconSrc = colorHeartIcon,
}) {
  const [isHeartClicked, setIsHeartClicked] = useState(initialLiked);
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { openLoginModal } = useLoginModal();
  const { showCopyModal } = useCopyModal();

  useEffect(() => {
    setIsHeartClicked(initialLiked);
  }, [initialLiked]);

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    // 드래그 종료 시 추가적인 처리가 필요하다면 여기에 작성
  };

  const handleCardClick = () => {
    if (!isDragging && onClick) {
      onClick();
    }
  };

  const handleHeartClick = async (e) => {
    e.stopPropagation(); // 상위로 클릭 이벤트 전파 방지
    if (!promptId) return;
    if (!isLoggedIn()) {
      openLoginModal();
      return;
    }

    try {
      const response = await apiClient.post(`/api/prompts/${promptId}/likes`);

      if (response.data) {
        setIsHeartClicked(response.data.liked);
        if (onHeartToggle) {
          onHeartToggle(promptId, response.data.liked);
        }
        console.log("좋아요 상태 업데이트:", response.data);
      }
    } catch (error) {
      console.error("좋아요 요청 실패:", error);
      alert("좋아요 요청에 실패했습니다.");
    }
  };

  const handleCopyClick = async (e) => {
    e.stopPropagation();
    if (!promptId) return;

    try {
      const response = await apiClient.patch(`/api/prompts/${promptId}/copy`);

      if (response.data && response.data.content) {
        await navigator.clipboard.writeText(response.data.content);
        showCopyModal();
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } else {
        alert("복사할 내용이 없습니다.");
      }
    } catch (error) {
      console.error("프롬프트 상세 정보 조회 실패:", error);
      alert("프롬프트 내용을 복사하는데 실패했습니다.");
    }
  };

  return (
    <PromptCardContainer
      backgroundImage={backgroundImage}
      draggable={draggable}
      $isDraggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCardClick}
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
          src={isHeartClicked ? heartSelectedIconSrc : heartIconSrc}
          onClick={handleHeartClick}
        />
        <CopyIcon
          src={isCopied ? copyCompleteIcon : copyIcon}
          onClick={handleCopyClick}
        />
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

  @media (max-width: 1600px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const CopyIcon = styled.img`
  width: 1.75rem;
  height: 1.75rem;
  margin-left: 0.37rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 1600px) {
    width: 1.5rem;
    height: 1.5rem;
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

  @media (max-width: 1600px) {
    font-size: 0.75rem;
    width: 5rem;
  }
`;

const PromptCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.94rem 1.37rem;
  width: calc((100% - 4rem) / 3);
  aspect-ratio: 2/1;
  background-color: pink;
  border-radius: 1rem;
  // border: 1px solid rgba(0, 0, 0, 0.1);
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

  @media (max-width: 1600px) {
    padding: 0.8rem 1.2rem;
    min-height: 9.5rem;
  }

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

  @media (max-width: 1600px) {
    width: calc((100% - 2rem) / 3);
    padding: 0.9rem 1.2rem;
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

  @media (max-width: 1600px) {
    font-size: 0.9rem;
  }
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

  @media (max-width: 1600px) {
    font-size: 1.1rem;
    margin-top: 0.3rem;
    margin-left: 0.2rem;
  }
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
  max-height: 2.4em; /* 1.2 * 2줄 = 2.4em. 폰트 크기에 비례하므로 정확함 */
  color: ${({ $hasBackgroundImage }) =>
    $hasBackgroundImage ? "#ffffff" : "#000000"};

  @media (max-width: 1600px) {
    font-size: 0.9rem;
    margin-left: 0.2rem;
  }
`;
