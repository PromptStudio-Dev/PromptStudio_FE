import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ChatMessage = ({ message }) => {
  const { content, promptCardHeight, promptCardWidth, imageLayout, type } =
    message;
  const { text, promptCard, images } = content;

  const isAssistant = type === "assistant";
  const isLoading = type === "loading";

  // 어시스턴트 메시지의 순차적 타이핑 효과
  const [displayedText, setDisplayedText] = useState("");
  const fullText = text || "";

  useEffect(() => {
    if (isAssistant && fullText) {
      setDisplayedText("");
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex += 1;
        } else {
          clearInterval(typingInterval);
        }
      }, 30); // 30ms마다 한 글자씩 (타이핑 속도 조절 가능)

      return () => clearInterval(typingInterval);
    }
  }, [isAssistant, fullText]);

  // 로딩 메시지인 경우 애니메이션과 함께 표시
  if (isLoading) {
    const loadingText = text || "결과 사냥중...";
    const characters = loadingText.split("");

    return (
      <AssistantMessageContainer>
        <LoadingMessageText>
          {characters.map((char, index) => (
            <LoadingChar key={index} $delay={index * 0.15}>
              {char === " " ? "\u00A0" : char}
            </LoadingChar>
          ))}
        </LoadingMessageText>
      </AssistantMessageContainer>
    );
  }

  // 어시스턴트 메시지인 경우 순차적으로 텍스트 표시
  if (isAssistant) {
    return (
      <AssistantMessageContainer>
        <AssistantMessageText>
          {displayedText}
          {displayedText.length < fullText.length && (
            <TypingCursor>|</TypingCursor>
          )}
        </AssistantMessageText>
      </AssistantMessageContainer>
    );
  }

  const hasPromptCard = Boolean(promptCard);
  const hasImages = Array.isArray(images) && images.length > 0;
  const hasBackgroundImage = Boolean(promptCard?.backgroundImage);

  const fixedHeight =
    typeof promptCardHeight === "number" && promptCardHeight > 0
      ? promptCardHeight
      : typeof imageLayout?.fixedHeight === "number" &&
        imageLayout.fixedHeight > 0
      ? imageLayout.fixedHeight
      : null;

  const imagesHeight =
    fixedHeight ||
    (typeof imageLayout?.height === "number" && imageLayout.height > 0
      ? imageLayout.height
      : null);

  const promptCardStyle = {};
  if (typeof promptCardWidth === "number" && promptCardWidth > 0) {
    const px = `${promptCardWidth}px`;
    Object.assign(promptCardStyle, {
      width: px,
      minWidth: px,
      maxWidth: px,
    });
  }

  const imagesWrapperStyle = {};
  if (typeof imageLayout?.width === "number" && imageLayout.width > 0) {
    const px = `${imageLayout.width}px`;
    Object.assign(imagesWrapperStyle, {
      width: px,
      minWidth: px,
      maxWidth: px,
    });
  } else {
    imagesWrapperStyle.width = "min(50%, 26rem)";
    imagesWrapperStyle.maxWidth = "26rem";
  }

  const imagesGridStyle = {};
  if (imageLayout?.gridTemplateColumns) {
    imagesGridStyle["--grid-template-columns"] =
      imageLayout.gridTemplateColumns;
  }
  if (imageLayout?.gridTemplateRows) {
    imagesGridStyle["--grid-template-rows"] = imageLayout.gridTemplateRows;
  }
  if (imageLayout?.imageSize) {
    imagesGridStyle["--image-size"] = imageLayout.imageSize;
  }
  if (typeof imageLayout?.width === "number" && imageLayout.width > 0) {
    const px = `${imageLayout.width}px`;
    Object.assign(imagesGridStyle, {
      width: px,
      minWidth: px,
      maxWidth: px,
    });
  } else {
    imagesGridStyle.width = "min(50%, 26rem)";
    imagesGridStyle.maxWidth = "26rem";
  }
  if (imagesHeight) {
    const px = `${imagesHeight}px`;
    Object.assign(imagesGridStyle, {
      height: px,
      minHeight: px,
      maxHeight: px,
    });
  }

  const determineColumns = () => {
    if (imageLayout?.gridTemplateColumns) {
      const repeatMatch =
        imageLayout.gridTemplateColumns.match(/repeat\((\d+)/);
      if (repeatMatch) {
        const parsed = parseInt(repeatMatch[1], 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
      const tokens = imageLayout.gridTemplateColumns
        .split(/\s+/)
        .filter(Boolean);
      if (
        tokens.length > 0 &&
        !imageLayout.gridTemplateColumns.includes("repeat")
      ) {
        return tokens.length;
      }
    }

    if (!hasImages) return 0;

    if (hasPromptCard) {
      if (images.length <= 1) return 1;
      if (images.length === 2) return 2;
      return Math.min(3, images.length);
    }

    if (images.length <= 1) return 1;
    if (images.length === 2) return 2;
    return Math.min(3, images.length);
  };

  const columns = hasImages ? determineColumns() : 0;

  const renderImages = [];
  if (hasImages && columns > 0) {
    for (let start = 0; start < images.length; start += columns) {
      const rowItems = images.slice(start, start + columns);
      const placeholdersCount = Math.max(columns - rowItems.length, 0);
      for (let p = 0; p < placeholdersCount; p += 1) {
        renderImages.push(
          <PlaceholderItem
            key={`placeholder-${start}-${p}`}
            aria-hidden="true"
          />
        );
      }
      rowItems.forEach((image) => {
        renderImages.push(
          <ImageItem key={image.id}>
            <Image src={image.preview} alt="첨부된 이미지" />
          </ImageItem>
        );
      });
    }
  }

  return (
    <MessageContainer>
      {(hasPromptCard || hasImages) && (
        <MessageContentRow>
          {hasImages && (
            <MessageImagesWrapper
              $hasPromptCard={hasPromptCard}
              style={
                Object.keys(imagesWrapperStyle).length
                  ? imagesWrapperStyle
                  : undefined
              }
            >
              <MessageImages
                style={
                  Object.keys(imagesGridStyle).length
                    ? imagesGridStyle
                    : undefined
                }
                $scrollable={Boolean(imagesHeight)}
              >
                {renderImages}
              </MessageImages>
            </MessageImagesWrapper>
          )}

          {hasPromptCard && (
            <MessagePromptCard
              $fixedHeight={fixedHeight}
              $hasBackgroundImage={hasBackgroundImage}
              $backgroundImage={promptCard.backgroundImage}
              style={
                Object.keys(promptCardStyle).length
                  ? promptCardStyle
                  : undefined
              }
            >
              <CardHeader>
                <CategoryTag>{promptCard.category}</CategoryTag>
                <AiName $hasBackgroundImage={hasBackgroundImage}>
                  {promptCard.aiName}
                </AiName>
              </CardHeader>
              <CardTitle $hasBackgroundImage={hasBackgroundImage}>
                {promptCard.title}
              </CardTitle>
              <CardSubtitle $hasBackgroundImage={hasBackgroundImage}>
                {promptCard.subtitle}
              </CardSubtitle>
            </MessagePromptCard>
          )}
        </MessageContentRow>
      )}

      {text && <MessageText>{text}</MessageText>}
    </MessageContainer>
  );
};

export default ChatMessage;

// 스타일 컴포넌트들
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
`;

const MessageContentRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const MessagePromptCard = styled.div`
  position: relative;
  width: min(50%, 26rem);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

  ${({ $fixedHeight }) =>
    typeof $fixedHeight === "number" && $fixedHeight > 0
      ? `
  height: ${$fixedHeight}px;
  min-height: ${$fixedHeight}px;
  max-height: ${$fixedHeight}px;
  overflow: hidden;
  `
      : ""}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ $hasBackgroundImage }) =>
      $hasBackgroundImage ? "rgba(0, 0, 0, 0.5)" : "transparent"};
    border-radius: 0.9rem;
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryTag = styled.span`
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

const AiName = styled.span`
  font-family: "Pretendard";
  font-size: 0.8125rem;
  font-weight: 600;
  color: #00aeff;
`;

const CardTitle = styled.h3`
  margin: 0;
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

const CardSubtitle = styled.p`
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

const MessageImagesWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: ${({ $hasPromptCard }) =>
    $hasPromptCard ? "min(50%, 26rem)" : "100%"};
  max-width: ${({ $hasPromptCard }) => ($hasPromptCard ? "26rem" : "100%")};
  min-width: 0;
`;

const MessageImages = styled.div`
  display: grid;
  gap: 0.5rem;
  padding: 0;
  box-sizing: border-box;
  grid-auto-flow: row dense;
  grid-template-rows: var(--grid-template-rows, auto);
  grid-auto-rows: 0;
  grid-template-columns: var(
    --grid-template-columns,
    repeat(auto-fit, minmax(80px, 1fr))
  );
  justify-content: flex-end;
  align-content: flex-start;
  align-items: flex-start;

  ${({ $scrollable }) =>
    $scrollable
      ? `
  overflow-y: auto;
  `
      : ""}
`;

const ImageItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f5f5f5;
  width: var(--image-size, auto);
  height: var(--image-size, auto);
  max-height: var(--image-size, none);
`;

const PlaceholderItem = styled.div`
  width: var(--image-size, auto);
  height: var(--image-size, auto);
  max-height: var(--image-size, none);
  aspect-ratio: 1;
  border-radius: 0.5rem;
  visibility: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MessageText = styled.div`
  max-width: 75%;
  border-radius: 0.5rem;
  background: #f1f1f1;
  padding: 0.4rem 0.75rem;
  font-size: 1rem;
  font-family: "Pretendard", sans-serif;
  line-height: 1.5;
  color: #001e40;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const AssistantMessageContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const AssistantMessageText = styled.div`
  width: 100%;
  font-size: 1rem;
  font-family: "Pretendard", sans-serif;
  line-height: 1.5;
  color: #001e40;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const TypingCursor = styled.span`
  display: inline-block;
  margin-left: 2px;
  color: #001e40;
  animation: blink 1s infinite;

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }
`;

const LoadingMessageText = styled.div`
  width: 100%;
  font-size: 1rem;
  font-family: "Pretendard", sans-serif;
  line-height: 1.5;
  color: #001e40;
  word-wrap: break-word;
  white-space: pre-wrap;
  display: inline-block;
`;

const LoadingChar = styled.span`
  display: inline-block;
  animation: brightnessColorWave 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation-delay: ${({ $delay }) => $delay}s;

  @keyframes brightnessColorWave {
    0%,
    100% {
      opacity: 0.4;
      filter: brightness(0.6) hue-rotate(0deg);
      color: #001e40;
    }
    50% {
      opacity: 1;
      filter: brightness(1.3) hue-rotate(10deg);
      color: #00aeff;
    }
  }
`;
