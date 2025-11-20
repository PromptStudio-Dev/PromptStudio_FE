import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import apiClient from "../../api/client";

// 커스텀 훅들
import { useDragDrop } from "./hooks/useDragDrop";
import { useImageAttachment } from "./hooks/useImageAttachment";
import { useTextareaAutoResize } from "./hooks/useTextareaAutoResize";
import { useLayoutCalculation } from "./hooks/useLayoutCalculation";

// 컴포넌트들
import DroppedPromptPreview from "./components/DroppedPromptPreview";
import AttachedImagesPreview from "./components/AttachedImagesPreview";
import ChatSendBox from "./components/ChatSendBox";
import ChatMessage from "./components/ChatMessage";
import PromptDropModal from "./components/PromptDropModal";
import promptDragIcon from "./assets/promptDragIcon.svg";

export default function ChatBar() {
  const [droppedPrompt, setDroppedPrompt] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPromptData, setPendingPromptData] = useState(null);
  const [modalPromptData, setModalPromptData] = useState(null);
  const chatViewSectionRef = useRef(null);

  // 커스텀 훅들 사용
  const { isHighlighted, handleDragOver } = useDragDrop();
  const {
    attachedImages,
    fileInputRef,
    handleImageAttachClick,
    handleImageSelect,
    handleImageRemove,
    clearImages,
    replaceImagesWithFiles,
  } = useImageAttachment();
  const { textareaRef, handleTextareaChange: originalHandleTextareaChange } =
    useTextareaAutoResize();

  // textarea 변경 핸들러 래핑
  const handleTextareaChange = (e) => {
    originalHandleTextareaChange(e);
    setTextareaValue(e.target.value);
  };
  const {
    previewHeightPx,
    droppedPromptHeight,
    droppedPromptWidth,
    promptPreviewRef,
    imagesPreviewRef,
    chatSendBoxRef,
    chatSendAreaRef,
  } = useLayoutCalculation(droppedPrompt, attachedImages);

  useEffect(() => {
    const handleComposerReset = () => {
      setDroppedPrompt(null);
      setPendingPromptData(null);
      setModalPromptData(null);
      setTextareaValue("");
      clearImages();

      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
        const defaultHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${defaultHeight}px`;
      }
    };

    window.addEventListener("chatbar-reset", handleComposerReset);
    return () => {
      window.removeEventListener("chatbar-reset", handleComposerReset);
    };
  }, [clearImages, textareaRef]);

  // 드래그 앤 드롭 핸들러
  const handleDrop = async (event) => {
    event.preventDefault();

    const dataTransfer = event.dataTransfer;

    // 드래그 상태 초기화를 위한 이벤트 발생
    window.dispatchEvent(new Event("prompt-card-dragend"));

    try {
      const rawData = dataTransfer?.getData("application/json");
      if (!rawData) return;

      const parsed = JSON.parse(rawData);
      if (!parsed || typeof parsed !== "object") return;

      if (!parsed.promptId) {
        console.warn("드랍된 프롬프트에 promptId가 없습니다.", parsed);
        return;
      }

      setPendingPromptData(parsed);
      setModalPromptData(null);

      const { data } = await apiClient.get(
        `/api/prompts/${parsed.promptId}/placeholders`
      );

      const placeholders = Array.isArray(data?.placeholders)
        ? data.placeholders.map((name) => ({ name }))
        : [];

      const templateData = {
        text: data?.content ?? "",
        fields: placeholders,
        imageRequired: Boolean(data?.imageRequired),
      };

      const shouldOpenModal = Boolean(
        data?.imageRequired || data?.placeholderRequired
      );

      if (shouldOpenModal) {
        setModalPromptData(templateData);
        setIsModalOpen(true);
      } else {
        setDroppedPrompt({
          ...parsed,
          promptText: templateData.text,
          rawPromptText: templateData.text,
          fieldValues: {},
          fields: placeholders,
        });
        setPendingPromptData(null);
      }
    } catch (error) {
      console.error("프롬프트 상세 정보를 불러오지 못했습니다.", error);
      setPendingPromptData(null);
      setModalPromptData(null);
      setIsModalOpen(false);
    }
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    setPendingPromptData(null);
    setModalPromptData(null);
  };

  const handleModalApply = ({
    filledPromptText,
    fieldValues,
    originalPromptText,
    fields,
    images,
  }) => {
    if (!pendingPromptData) return;

    setDroppedPrompt({
      ...pendingPromptData,
      promptText: filledPromptText,
      rawPromptText: originalPromptText,
      fieldValues,
      fields,
    });

    if (Array.isArray(images) && images.length > 0) {
      replaceImagesWithFiles(images);
    }

    setIsModalOpen(false);
    setPendingPromptData(null);
    setModalPromptData(null);
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    const textContent = textareaValue.trim() || "";
    const hasContent =
      textContent || droppedPrompt || attachedImages.length > 0;

    if (!hasContent) return; // 최소 1개 이상의 내용이 있어야 함

    let imageLayout = null;
    if (attachedImages.length > 0 && imagesPreviewRef.current) {
      const inlineStyle = imagesPreviewRef.current.style;
      const imagesRect = imagesPreviewRef.current.getBoundingClientRect();
      imageLayout = {
        gridTemplateColumns:
          inlineStyle.getPropertyValue("--grid-template-columns") || "",
        gridTemplateRows:
          inlineStyle.getPropertyValue("--grid-template-rows") || "",
        imageSize: inlineStyle.getPropertyValue("--image-size") || "",
        hasPrompt: !!droppedPrompt,
        fixedHeight: previewHeightPx,
        width: imagesRect?.width || null,
        height: imagesRect?.height || null,
      };
    }

    // 메시지 생성
    const newMessage = {
      id: Date.now(),
      content: {
        text: textContent,
        promptCard: droppedPrompt,
        images: attachedImages.map(({ id, preview }) => ({
          id,
          preview,
        })), // 이미지 최소 정보 복사
      },
      promptCardHeight: droppedPromptHeight, // 프롬프트 카드의 실제 높이 저장
      promptCardWidth: droppedPromptWidth,
      imageLayout,
      timestamp: new Date(),
    };

    // 메시지 추가
    setMessages((prev) => [...prev, newMessage]);

    // 로딩 메시지 추가
    const loadingMessageId = Date.now() + 1;
    const loadingMessage = {
      id: loadingMessageId,
      type: "loading",
      content: {
        text: "결과 사냥중...",
      },
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    // 응답 메시지 추가 (더미 데이터) - 3초 후
    setTimeout(() => {
      // 로딩 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));

      const assistantMessage = {
        id: Date.now() + 2,
        type: "assistant",
        content: {
          text: "이것은 응답 메시지입니다. 실제 API 연동 시 여기에 서버로부터 받은 응답이 표시됩니다.",
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 3000); // 3초 후 응답 메시지 추가

    // 전송 후 상태 초기화
    if (textareaRef.current) {
      textareaRef.current.value = "";
      // 높이를 초기값으로 복귀 (placeholder가 있을 때의 실제 높이 측정)
      textareaRef.current.style.height = "auto";
      const defaultHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${defaultHeight}px`;
    }
    setTextareaValue("");
    setDroppedPrompt(null);
    clearImages({ keepUrls: true }); // 첨부 이미지 초기화 (URL 유지)
  };

  // 엔터키 핸들러
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 전송 가능 여부 확인
  const hasContent =
    textareaValue.trim() || droppedPrompt || attachedImages.length > 0;

  // 메시지가 추가될 때마다 하단으로 스크롤
  useEffect(() => {
    if (chatViewSectionRef.current && messages.length > 0) {
      // DOM 업데이트 후 스크롤을 위해 이중 requestAnimationFrame 사용
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (chatViewSectionRef.current) {
            chatViewSectionRef.current.scrollTop =
              chatViewSectionRef.current.scrollHeight;
          }
        });
      });
    }
  }, [messages.length]);

  return (
    <ChatBarContainer
      $isHighlighted={isHighlighted}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ChatViewSection ref={chatViewSectionRef}>
        {messages.length === 0 ? (
          <EmptyMessageWrapper>
            <EmptyMessageIcon src={promptDragIcon} alt="프롬프트 드래그 안내" />
            <EmptyMessageText>
              프로의 프롬프트를{"\n"}여기로 끌어당겨서{"\n"}지금 바로
              사용해보세요.
            </EmptyMessageText>
          </EmptyMessageWrapper>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </ChatViewSection>
      <ChatSendArea ref={chatSendAreaRef}>
        {droppedPrompt && (
          <DroppedPromptPreview
            ref={promptPreviewRef}
            backgroundImage={droppedPrompt.backgroundImage}
            fixedHeight={previewHeightPx}
            onRemove={() => setDroppedPrompt(null)}
            category={droppedPrompt.category}
            aiName={droppedPrompt.aiName}
            title={droppedPrompt.title}
            subtitle={droppedPrompt.subtitle}
          />
        )}
        <AttachedImagesPreview
          ref={imagesPreviewRef}
          attachedImages={attachedImages}
          hasDroppedPrompt={!!droppedPrompt}
          imageCount={attachedImages.length}
          isHidden={attachedImages.length === 0 && !droppedPrompt}
          onImageRemove={handleImageRemove}
        />
        <ChatSendBox
          ref={chatSendBoxRef}
          textareaRef={textareaRef}
          handleTextareaChange={handleTextareaChange}
          fileInputRef={fileInputRef}
          handleImageAttachClick={handleImageAttachClick}
          handleImageSelect={handleImageSelect}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          onSendMessage={handleSendMessage}
          onKeyDown={handleKeyDown}
          hasContent={hasContent}
        />
      </ChatSendArea>
      <PromptDropModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        promptData={modalPromptData}
        onApply={handleModalApply}
      />
    </ChatBarContainer>
  );
}

// 스타일 컴포넌트들
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

const ChatSendArea = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

const EmptyMessageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
`;

const EmptyMessageIcon = styled.img`
  width: 2.25rem;
  height: 2.25rem;
`;

const EmptyMessageText = styled.p`
  margin: 0;
  white-space: pre-line;
  color: var(--B-A6, #a6a6a6);
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.3125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.625rem;
`;
