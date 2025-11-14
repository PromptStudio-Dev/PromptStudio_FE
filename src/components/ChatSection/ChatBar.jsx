import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import AttachmentIcon from "./assets/imageAttachIcon.svg";
import sendPossibleIcon from "./assets/sendPossibleIcon.svg";
import DownIcon from "./assets/downIcon.svg";

export default function ChatBar() {
  const [droppedPrompt, setDroppedPrompt] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPromptDragging, setIsPromptDragging] = useState(false);
  const [attachedImages, setAttachedImages] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const promptPreviewRef = useRef(null);
  const imagesPreviewRef = useRef(null);
  const chatSendBoxRef = useRef(null);
  const chatSendAreaRef = useRef(null);
  const savedPromptHeightRef = useRef(null);
  const [previewHeightPx, setPreviewHeightPx] = useState(null);

  useEffect(() => {
    const handlePromptDragStartEvent = () => setIsPromptDragging(true);
    const handlePromptDragEndEvent = () => {
      setIsPromptDragging(false);
      setIsDragOver(false);
    };

    window.addEventListener(
      "prompt-card-dragstart",
      handlePromptDragStartEvent
    );
    window.addEventListener("prompt-card-dragend", handlePromptDragEndEvent);

    return () => {
      window.removeEventListener(
        "prompt-card-dragstart",
        handlePromptDragStartEvent
      );
      window.removeEventListener(
        "prompt-card-dragend",
        handlePromptDragEndEvent
      );
    };
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    setIsPromptDragging(false);

    try {
      const rawData = event.dataTransfer.getData("application/json");
      if (!rawData) return;

      const parsed = JSON.parse(rawData);
      if (parsed && typeof parsed === "object") {
        setDroppedPrompt(parsed);
      }
    } catch (error) {
      console.error("드래그 데이터 파싱에 실패했습니다.", error);
    }
  };

  const isHighlighted = isPromptDragging || isDragOver;

  const handleImageAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (attachedImages.length + imageFiles.length > 6) {
      alert("이미지는 최대 6장까지 첨부할 수 있습니다.");
      const remainingSlots = 6 - attachedImages.length;
      const filesToAdd = imageFiles.slice(0, remainingSlots);
      addImages(filesToAdd);
    } else {
      addImages(imageFiles);
    }

    // input 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addImages = (files) => {
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setAttachedImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemove = (imageId) => {
    setAttachedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 높이를 초기화하여 scrollHeight를 정확히 계산
    textarea.style.height = "auto";

    // scrollHeight를 가져와서 높이 설정 (최대 11rem)
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 11 * 16; // 11rem을 px로 변환 (1rem = 16px)

    if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`;
    } else {
      textarea.style.height = `${maxHeight}px`;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      handleTextareaChange();
    }
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!chatSendBoxRef.current) return;
      const rect = chatSendBoxRef.current.getBoundingClientRect();
      if (!rect || !rect.height) return;
      savedPromptHeightRef.current = rect.height;
      setPreviewHeightPx((prev) =>
        typeof prev === "number" && Math.abs(prev - rect.height) <= 0.5
          ? prev
          : rect.height
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  // 컴포넌트 언마운트 시 이미지 URL 정리
  useEffect(() => {
    return () => {
      attachedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [attachedImages]);

  // 이미지 미리보기 높이와 이미지 크기 설정
  useEffect(() => {
    if (!imagesPreviewRef.current) return;

    const updateHeight = () => {
      if (!imagesPreviewRef.current) return;

      // ChatSendBox와 동일한 높이 사용 (없으면 fallback)
      let heightToUsePx =
        typeof previewHeightPx === "number" && previewHeightPx > 0
          ? previewHeightPx
          : savedPromptHeightRef.current || 0;

      if ((!heightToUsePx || heightToUsePx <= 0) && chatSendBoxRef.current) {
        const rect = chatSendBoxRef.current.getBoundingClientRect();
        if (rect && rect.height) {
          heightToUsePx = rect.height;
        }
      }

      if (!heightToUsePx && attachedImages.length > 0) {
        // 프롬프트 카드가 없고 아직 높이를 모르는 경우 이미지 개수로 계산
        const gapPx = 8;
        const imageCount = attachedImages.length;
        let rows = imageCount <= 3 ? 1 : 2;
        const minImageSizePx = 80;
        heightToUsePx = minImageSizePx * rows + (rows - 1) * gapPx;
      }

      if (!heightToUsePx) {
        heightToUsePx = 150;
      }

      savedPromptHeightRef.current = heightToUsePx;

      // 이미지 영역 높이 고정
      const heightValue = `${heightToUsePx}px`;
      imagesPreviewRef.current.style.height = heightValue;
      imagesPreviewRef.current.style.minHeight = heightValue;
      imagesPreviewRef.current.style.maxHeight = heightValue;

      // 이미지가 있을 때만 그리드 크기 계산
      if (attachedImages.length > 0) {
        const gapPx = 8; // 0.5rem = 8px (디자인 기준)
        const gapBetweenPromptAndImages = 12; // 0.75rem = 12px
        const imageCount = attachedImages.length;
        const hasPrompt = !!promptPreviewRef.current;

        // 사용 가능한 width 계산
        let availableWidthPx = 0;
        if (chatSendAreaRef.current) {
          const sendAreaRect = chatSendAreaRef.current.getBoundingClientRect();
          const totalWidth = sendAreaRect.width;

          if (hasPrompt && promptPreviewRef.current) {
            const promptRect = promptPreviewRef.current.getBoundingClientRect();
            const promptWidth = promptRect.width;
            availableWidthPx =
              totalWidth - promptWidth - gapBetweenPromptAndImages;
          } else {
            availableWidthPx = totalWidth;
          }
        }

        const computeLayout = (count) => {
          if (hasPrompt) {
            if (count <= 1) return { columns: 1, rows: 1 };
            if (count === 2) return { columns: 2, rows: 1 };
            const columns = 3;
            const rows = Math.min(2, Math.max(1, Math.ceil(count / columns)));
            return { columns, rows };
          }
          if (count <= 1) return { columns: 1, rows: 1 };
          if (count === 2) return { columns: 2, rows: 1 };
          const columns = 3;
          const rows = Math.min(2, Math.max(1, Math.ceil(count / columns)));
          return { columns, rows };
        };

        const { columns, rows } = computeLayout(imageCount);

        // 높이 기반 이미지 크기 계산
        const rowSizePx =
          rows > 0
            ? (heightToUsePx - (rows - 1) * gapPx) / rows
            : heightToUsePx;

        // width 기반 이미지 크기 계산
        let widthBasedSizePx = 0;
        if (availableWidthPx > 0 && columns > 0) {
          widthBasedSizePx =
            (availableWidthPx - (columns - 1) * gapPx) / columns;
        }

        // 높이와 width 중 작은 값을 사용하여 정사각형 유지
        const imageSizePx = Math.max(
          0,
          Math.min(
            rowSizePx,
            widthBasedSizePx > 0 ? widthBasedSizePx : rowSizePx
          )
        );

        imagesPreviewRef.current.style.setProperty(
          "--grid-template-columns",
          `repeat(${columns || 1}, ${imageSizePx}px)`
        );
        imagesPreviewRef.current.style.setProperty(
          "--grid-template-rows",
          `repeat(${rows || 1}, ${imageSizePx}px)`
        );

        imagesPreviewRef.current.style.setProperty(
          "--image-size",
          `${imageSizePx}px`
        );

        if (
          typeof previewHeightPx !== "number" ||
          Math.abs(previewHeightPx - heightToUsePx) > 0.5
        ) {
          setPreviewHeightPx(heightToUsePx);
        }
      } else {
        imagesPreviewRef.current.style.removeProperty(
          "--grid-template-columns"
        );
        imagesPreviewRef.current.style.removeProperty("--grid-template-rows");
        imagesPreviewRef.current.style.removeProperty("--image-size");
      }
    };

    // DOM 렌더링 완료 후 높이 측정
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateHeight();
      });
    });
  }, [droppedPrompt, attachedImages, previewHeightPx]);

  return (
    <ChatBarContainer
      $isHighlighted={isHighlighted}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ChatViewSection></ChatViewSection>
      <ChatSendArea ref={chatSendAreaRef}>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
        />
        {droppedPrompt && (
          <DroppedPromptPreview
            ref={promptPreviewRef}
            $backgroundImage={droppedPrompt.backgroundImage}
            $fixedHeight={previewHeightPx}
          >
            <PreviewRemoveButton
              type="button"
              aria-label="미리보기 제거"
              onClick={() => setDroppedPrompt(null)}
            >
              ✕
            </PreviewRemoveButton>
            <DroppedPromptHeader>
              <DroppedPromptCategory>
                {droppedPrompt.category}
              </DroppedPromptCategory>
              <DroppedPromptAiName>{droppedPrompt.aiName}</DroppedPromptAiName>
            </DroppedPromptHeader>
            <DroppedPromptTitle>{droppedPrompt.title}</DroppedPromptTitle>
            <DroppedPromptSubtitle>
              {droppedPrompt.subtitle}
            </DroppedPromptSubtitle>
          </DroppedPromptPreview>
        )}
        <AttachedImagesPreview
          ref={imagesPreviewRef}
          $hasDroppedPrompt={!!droppedPrompt}
          $imageCount={attachedImages.length}
          $isHidden={attachedImages.length === 0 && !droppedPrompt}
        >
          {attachedImages.map((image) => (
            <ImagePreviewItem key={image.id}>
              <ImagePreviewRemoveButton
                type="button"
                aria-label="이미지 제거"
                onClick={() => handleImageRemove(image.id)}
              >
                ✕
              </ImagePreviewRemoveButton>
              <ImagePreview src={image.preview} alt="첨부된 이미지" />
            </ImagePreviewItem>
          ))}
        </AttachedImagesPreview>
        <ChatSendBox
          ref={chatSendBoxRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <ChatSendBoxInput
            ref={textareaRef}
            placeholder="오늘 어떤 도움을 드릴까요"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onChange={handleTextareaChange}
            onInput={handleTextareaChange}
          ></ChatSendBoxInput>
          <ChatSendBoxBottomSection>
            <ChatSendBoxImageAttachButton
              src={AttachmentIcon}
              alt="이미지 첨부"
              onClick={handleImageAttachClick}
              style={{ cursor: "pointer" }}
            ></ChatSendBoxImageAttachButton>
            <ChatSendBoxRightGroup>
              <ChatSendOptionButton type="button">
                <ChatSendOptionLabel>GPT 5 Plus</ChatSendOptionLabel>
                <ChatSendOptionIcon src={DownIcon} alt="옵션 선택" />
              </ChatSendOptionButton>
              <ChatSendBoxSendMessageButton
                src={sendPossibleIcon}
                alt="메시지 전송"
              ></ChatSendBoxSendMessageButton>
            </ChatSendBoxRightGroup>
          </ChatSendBoxBottomSection>
        </ChatSendBox>
      </ChatSendArea>
    </ChatBarContainer>
  );
}

const ChatSendBoxInput = styled.textarea`
  width: 100%;
  min-height: 4rem;
  max-height: 11rem;
  height: 5.5rem;
  // padding: 1rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  background: transparent;
  color: #001e40;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: height 0.2s ease;
  overflow-y: auto;
  box-sizing: border-box;

  &::placeholder {
    color: #9bb4c9;
  }
`;

const ChatSendArea = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

const DroppedPromptPreview = styled.div`
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 0;
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
  color: #001e40;
  pointer-events: auto;
  ${({ $fixedHeight }) =>
    typeof $fixedHeight === "number" && $fixedHeight > 0
      ? `
    height: ${$fixedHeight}px;
    min-height: ${$fixedHeight}px;
    max-height: ${$fixedHeight}px;
    overflow: hidden;
  `
      : ""}
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
  background: rgba(255, 255, 255, 0.85);
  color: #003355;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${DroppedPromptPreview}:hover & {
    opacity: 1;
  }
`;

const DroppedPromptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #0079c5;
`;

const DroppedPromptAiName = styled.span`
  font-family: "Pretendard";
  font-size: 0.8125rem;
  font-weight: 600;
  color: #005b92;
`;

const DroppedPromptTitle = styled.h3`
  margin: 0;
  font-family: "Pretendard";
  font-size: 1.05rem;
  font-weight: 700;
  color: #001e40;
`;

const DroppedPromptSubtitle = styled.p`
  margin: 0;
  font-family: "Pretendard";
  font-size: 0.925rem;
  line-height: 1.45;
  color: #233243;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ChatSendBoxBottomSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ChatSendBoxRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ChatSendBoxImageAttachButton = styled.img`
  width: 1.9375rem;
  height: 1.9375rem;
`;

const ChatSendOptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const ChatSendOptionLabel = styled.span`
  font-family: "Pretendard";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #000;
`;

const ChatSendOptionIcon = styled.img`
  width: 1rem;
  height: 1rem;
`;

const ChatSendBoxSendMessageButton = styled.img`
  width: 2.25rem;
  height: 2.25rem;
`;

const ChatBarContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.44rem 2rem;
  background: ${({ $isHighlighted }) => ($isHighlighted ? "#eef8ff" : "#fff")};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  min-height: 0;
  border: 1px dashed
    ${({ $isHighlighted }) => ($isHighlighted ? "#00aeff" : "transparent")};
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

const ChatViewSection = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const ChatSendBox = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.3rem 1rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: -1px -1px 16px 0 #ddf4ff, 1px 1px 8px 0 rgba(0, 0, 0, 0.16);
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AttachedImagesPreview = styled.div`
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
