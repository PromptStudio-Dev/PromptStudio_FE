import { useState, useRef, useEffect, useCallback } from "react";
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
import { isLoggedIn } from "../../utils/authStorage";
import { useLoginModal } from "../../contexts/LoginModalContext";
import CopyCompleteModal from "../../components/CopyCompleteModal/CopyCompleteModal";

export default function ChatBar() {
  const [droppedPrompt, setDroppedPrompt] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPromptData, setPendingPromptData] = useState(null);
  const [modalPromptData, setModalPromptData] = useState(null);
  const [modalInitialValues, setModalInitialValues] = useState(null);
  const [modalInitialImages, setModalInitialImages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const isAutoScrollEnabledRef = useRef(true);
  const chatViewSectionRef = useRef(null);
  const { openLoginModal } = useLoginModal();
  const [showImageLimitAlert, setShowImageLimitAlert] = useState(false);
  const [isFileSizeModalOpen, setIsFileSizeModalOpen] = useState(false);

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
  } = useImageAttachment({
    onMaxImagesExceeded: () => {
      setShowImageLimitAlert(true);
      setTimeout(() => setShowImageLimitAlert(false), 2000);
    },
    onFileSizeExceeded: () => {
      setIsFileSizeModalOpen(true);
      setTimeout(() => setIsFileSizeModalOpen(false), 2000);
    },
  });
  const { textareaRef, handleTextareaChange: originalHandleTextareaChange } =
    useTextareaAutoResize();

  // textarea 변경 핸들러 래핑
  const handleTextareaChange = (e) => {
    originalHandleTextareaChange(e);
    setTextareaValue(e.target.value);
  };

  const ensureLoggedIn = () => {
    if (isLoggedIn()) return true;
    openLoginModal();
    return false;
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
      setModalInitialValues(null);
      setModalInitialImages(null);
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

  const loadPromptData = async (parsed) => {
    if (!parsed?.promptId) {
      console.warn("프롬프트에 promptId가 없습니다.", parsed);
      return;
    }

    setPendingPromptData(parsed);
    setModalPromptData(null);
    setModalInitialValues(null);
    setModalInitialImages(null);

    try {
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
          imageRequired: templateData.imageRequired,
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

      if (!ensureLoggedIn()) return;
      await loadPromptData(parsed);
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
    setModalInitialValues(null);
    setModalInitialImages(null);
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
      imageRequired:
        pendingPromptData.imageRequired ?? modalPromptData?.imageRequired,
    });

    if (Array.isArray(images) && images.length > 0) {
      replaceImagesWithFiles(images);
    }

    setIsModalOpen(false);
    setPendingPromptData(null);
    setModalPromptData(null);
    setModalInitialValues(null);
    setModalInitialImages(null);
  };

  const handleEditPrompt = () => {
    if (!droppedPrompt) return;

    const templateData = {
      text: droppedPrompt.rawPromptText || droppedPrompt.promptText || "",
      fields: droppedPrompt.fields || [],
      imageRequired: Boolean(droppedPrompt.imageRequired),
    };

    setPendingPromptData(droppedPrompt);
    setModalPromptData(templateData);
    setModalInitialValues(droppedPrompt.fieldValues || {});
    setModalInitialImages(attachedImages || []);
    setIsModalOpen(true);
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (!ensureLoggedIn()) return;
    // 응답 대기 중이거나 타이핑 중이면 전송 차단
    if (isLoading || isTyping) return;

    const textContent = textareaValue.trim() || "";
    const hasContent =
      textContent || droppedPrompt || attachedImages.length > 0;

    if (!hasContent) return; // 최소 1개 이상의 내용이 있어야 함

    // 로딩 상태 시작
    setIsLoading(true);
    isAutoScrollEnabledRef.current = true; // 전송 시 자동 스크롤 활성화

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
        text: "결과를 향해 헤엄치는 중",
      },
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    // API 호출
    const sendChatMessage = async () => {
      try {
        const formData = new FormData();

        // 프롬프트 카드가 있으면 promptText와 textContent를 연결
        const messageToSend = droppedPrompt?.promptText
          ? [droppedPrompt.promptText, textContent].filter(Boolean).join(" ")
          : textContent;
        formData.append("message", messageToSend);

        // 이미지 파일들 추가
        attachedImages.forEach((img) => {
          if (img.file) {
            formData.append("images", img.file);
          }
        });

        let response;

        if (!sessionId) {
          // 채팅 시작 API 호출
          response = await apiClient.post("/api/chat/start", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // sessionId 저장
          if (response.data?.sessionId) {
            setSessionId(response.data.sessionId);
          }
        } else {
          // 채팅 전송 API 호출
          formData.append("sessionId", sessionId);
          response = await apiClient.post("/api/chat/send", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        // 로딩 메시지 제거
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessageId)
        );

        const { resultType, content, imageUrl } = response.data;

        // 응답 메시지 생성
        const assistantMessage = {
          id: Date.now() + 2,
          type: "assistant",
          content:
            resultType === "IMAGE" ? { image: imageUrl } : { text: content },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // 로딩 상태 해제 후 타이핑 상태로 전환 (이미지 응답은 타이핑 없음)
        setIsLoading(false);
        if (resultType === "TEXT") {
          setIsTyping(true);
        }
      } catch (error) {
        console.error("채팅 전송 실패:", error);
        // 로딩 메시지 제거
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessageId)
        );
        setIsLoading(false);

        // 에러 메시지 표시
        const errorMessage = {
          id: Date.now() + 2,
          type: "assistant",
          content: {
            text: "죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.",
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    };

    sendChatMessage();

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
    if (e.key === "Enter" && !e.shiftKey && !isLoading && !isTyping) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = useCallback(() => {
    if (chatViewSectionRef.current && isAutoScrollEnabledRef.current) {
      chatViewSectionRef.current.scrollTop =
        chatViewSectionRef.current.scrollHeight;
    }
  }, []);

  // 사용자의 스크롤 조작 감지
  const handleScroll = () => {
    if (chatViewSectionRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatViewSectionRef.current;
      // 스크롤이 하단에 있는지 확인 (오차 범위 20px)
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 20;
      isAutoScrollEnabledRef.current = isAtBottom;
    }
  };

  // 사용자 인터랙션 발생 시 즉시 자동 스크롤 중지 (저항 제거용)
  const handleUserInteraction = () => {
    isAutoScrollEnabledRef.current = false;
  };

  // 전송 가능 여부 확인
  const hasContent =
    (textareaValue.trim() || droppedPrompt || attachedImages.length > 0) &&
    !isLoading &&
    !isTyping;

  // 메시지가 추가될 때마다 하단으로 스크롤
  useEffect(() => {
    if (!chatViewSectionRef.current) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });
  }, [messages.length, scrollToBottom]);

  // 상세/다른 페이지에서 "사용해 보기" 이벤트 처리
  useEffect(() => {
    const handleUsePrompt = (event) => {
      const data = event.detail;
      if (!data) return;
      if (!isLoggedIn()) {
        openLoginModal();
        return;
      }
      loadPromptData(data);
    };

    window.addEventListener("use-prompt", handleUsePrompt);
    return () => {
      window.removeEventListener("use-prompt", handleUsePrompt);
    };
  }, [openLoginModal]);

  // 메시지 영역 DOM 변경(타이핑, 애니메이션 등) 시 하단으로 스크롤
  useEffect(() => {
    if (
      !chatViewSectionRef.current ||
      typeof MutationObserver === "undefined"
    ) {
      return undefined;
    }

    let rafId = null;
    const target = chatViewSectionRef.current;

    const observer = new MutationObserver(() => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        scrollToBottom();
      });
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      observer.disconnect();
    };
  }, [scrollToBottom]);

  return (
    <ChatBarContainer
      $isHighlighted={isHighlighted}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ChatViewSection
        ref={chatViewSectionRef}
        onScroll={handleScroll}
        onWheel={handleUserInteraction}
        onTouchStart={handleUserInteraction}
      >
        {messages.length === 0 ? (
          <EmptyMessageWrapper>
            <EmptyMessageIcon src={promptDragIcon} alt="프롬프트 드래그 안내" />
            <EmptyMessageText>
              고퀄리티 프롬프트를{"\n"}여기로 끌어당겨서{"\n"}지금 바로
              사용해보세요!
            </EmptyMessageText>
          </EmptyMessageWrapper>
        ) : (
          messages.map((message, index) => {
            // 마지막 assistant 메시지에만 타이핑 완료 콜백 전달
            const isLastAssistant =
              message.type === "assistant" &&
              isTyping &&
              index === messages.length - 1;
            return (
              <ChatMessage
                key={message.id}
                message={message}
                onTypingComplete={
                  isLastAssistant ? () => setIsTyping(false) : undefined
                }
              />
            );
          })
        )}
      </ChatViewSection>
      <ChatSendArea ref={chatSendAreaRef}>
        {showImageLimitAlert && (
          <ImageLimitAlert>
            이미지는 최대 6개까지만 첨부할 수 있습니다.
          </ImageLimitAlert>
        )}
        {droppedPrompt && (
          <DroppedPromptPreview
            ref={promptPreviewRef}
            backgroundImage={droppedPrompt.backgroundImage}
            fixedHeight={previewHeightPx}
            onRemove={() => setDroppedPrompt(null)}
            onEdit={handleEditPrompt}
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
          value={textareaValue}
          handleTextareaChange={handleTextareaChange}
          fileInputRef={fileInputRef}
          handleImageAttachClick={handleImageAttachClick}
          handleImageSelect={handleImageSelect}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          onSendMessage={handleSendMessage}
          onKeyDown={handleKeyDown}
          hasContent={hasContent}
          isLoading={isLoading}
        />
      </ChatSendArea>
      <PromptDropModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        promptData={modalPromptData}
        onApply={handleModalApply}
        initialValues={modalInitialValues}
        initialImages={modalInitialImages}
      />
      <CopyCompleteModal
        isOpen={isFileSizeModalOpen}
        message="파일 크기가 초과되었습니다"
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

const ImageLimitAlert = styled.div`
  position: absolute;
  bottom: calc(100% + 8.5rem);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  padding: 0.625rem 1rem;
  justify-content: center;
  border-radius: 0.5rem;
  background: linear-gradient(97deg, #49d8ff -80.24%, #0062ff 108.79%);
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  box-sizing: border-box;
  white-space: nowrap;
  z-index: 10;
  animation: fadeInOut 2s ease-in-out forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    15% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    85% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
  }
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
  font-family: "Pretendard", sans-serif;
  font-size: 1.3125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.625rem;
`;
