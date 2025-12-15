import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import AIUpgradeModal from "../shared/AIUpgradeModal";

export default function PromptEditor({
  content,
  onContentChange,
  onUpgradeRequest,
  onAcceptUpgrade,
  onCancelUpgrade,
  onEditUpgrade,
  activeUpgradeId,
  activeUpgrade,
  isResultPanelOpen = false,
  insertedTextRange = null,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [initialModalPosition, setInitialModalPosition] = useState({
    top: 0,
    left: 0,
  }); // 드래그 시 초기 모달 위치 저장
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState(null);
  const [textareaScrollTop, setTextareaScrollTop] = useState(0);
  const [isUpgradeSubmitted, setIsUpgradeSubmitted] = useState(false); // 업그레이드 전송 여부
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);
  const isMouseDownInTextareaRef = useRef(false);

  const resetSelectionState = () => {
    setShowModal(false);
    setSelectionRange(null);
    setSelectedText("");
    setIsUpgradeSubmitted(false);
  };

  const handleMouseUp = useCallback(() => {
    // 업그레이드 중일 때는 아무 처리도 하지 않음
    if (isUpgradeSubmitted && activeUpgradeId == null) {
      return;
    }

    // textarea 내에서 시작하지 않았으면 무시
    if (!isMouseDownInTextareaRef.current) {
      isMouseDownInTextareaRef.current = false;
      return;
    }
    isMouseDownInTextareaRef.current = false;

    const textarea = textareaRef.current;
    if (!textarea) return;

    // 즉시 selection 체크
    const immediateStart = textarea.selectionStart;
    const immediateEnd = textarea.selectionEnd;

    if (immediateStart === immediateEnd) {
      return; // 선택 없으면 바로 리턴
    }

    const processSelection = () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // selection이 사라졌으면 무시
      if (start === end) {
        return;
      }

      const draggedText = content.substring(start, end);
      const trimmedText = draggedText.trim();

      if (trimmedText.length >= 40) {
        setSelectedText(draggedText);
        setSelectionRange({ start, end });
        console.log("드래그된 텍스트:", draggedText);

        const calculateModalPosition = () => {
          const textareaRect = textarea.getBoundingClientRect();
          const textUpToEnd = content.substring(0, end);
          const scrollTop = textarea.scrollTop || 0;

          const tempElement = document.createElement("div");
          tempElement.style.position = "absolute";
          tempElement.style.visibility = "hidden";
          tempElement.style.width = `${textarea.offsetWidth}px`;
          tempElement.style.fontFamily = '"Pretendard Variable", sans-serif';
          tempElement.style.fontSize = "1.25rem";
          tempElement.style.lineHeight = "1.625rem";
          tempElement.style.padding = "1rem 0";
          tempElement.style.whiteSpace = "pre-wrap";
          tempElement.style.wordWrap = "break-word";
          tempElement.textContent = textUpToEnd;

          document.body.appendChild(tempElement);
          const textEndHeight = tempElement.offsetHeight;
          document.body.removeChild(tempElement);

          const spacing = 0;
          const textEndTop = textareaRect.top + textEndHeight - scrollTop;
          const newTop = textEndTop + spacing;
          const newLeft = textareaRect.left;

          const estimatedModalWidth = Math.min(
            window.innerWidth * 0.38,
            49.1875 * 16
          );
          const maxLeft = Math.max(0, window.innerWidth - estimatedModalWidth);
          const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));

          const modalRect = modalRef.current?.getBoundingClientRect();
          const modalHeight = modalRect?.height ?? 0;
          const maxTop = Math.max(0, window.innerHeight - modalHeight);
          const clampedTop = Math.min(newTop, maxTop);

          const newPosition = {
            top: Math.max(0, clampedTop),
            left: clampedLeft,
          };
          setModalPosition(newPosition);
          setInitialModalPosition(newPosition);
        };

        // 먼저 모달 표시
        setShowModal(true);

        // DOM 렌더링 후 위치 계산
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            calculateModalPosition();
          });
        });
      } else {
        resetSelectionState();
      }
    };

    // 즉시 체크 (빠른 드래그 대응) - 추가
    processSelection();

    // 브라우저가 selection을 확정할 시간을 주고 다시 체크
    setTimeout(() => {
      processSelection();
    }, 10);
  }, [content, isUpgradeSubmitted, activeUpgradeId]);

  const handleMouseDown = useCallback(
    (e) => {
      // 업그레이드 중일 때는 아무 처리도 하지 않음
      if (isUpgradeSubmitted && activeUpgradeId == null) {
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) return;

      // textarea 내에서 mousedown이 발생했는지 확인
      const isInsideTextarea =
        textarea.contains(e.target) || textarea === e.target;
      isMouseDownInTextareaRef.current = isInsideTextarea;

      if (!isInsideTextarea) {
        return;
      }

      // 마우스를 누르면 모달 숨김 (새로운 선택 시작)
      if (showModal) {
        // 기존에 활성화된 업그레이드가 있으면 취소
        if (activeUpgradeId) {
          onCancelUpgrade?.(activeUpgradeId);
        }
        setShowModal(false);
      }
      // 모달이 없어도 업그레이드가 활성화되어 있으면 취소 (다른 텍스트 드래그 시작)
      else if (activeUpgradeId) {
        onCancelUpgrade?.(activeUpgradeId);
      }
    },
    [showModal, activeUpgradeId, onCancelUpgrade, isUpgradeSubmitted]
  );

  // 기존에는 textarea 레벨에서 props 로 감지했지만, 이제는 document 레벨에서 감지
  useEffect(() => {
    const handleDocumentMouseDown = (e) => {
      handleMouseDown(e);
    };

    const handleDocumentMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("mouseup", handleDocumentMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [handleMouseDown, handleMouseUp]);

  // 업그레이드 결과가 나왔을 때 모달 위치를 텍스트 높이에 맞춰 조정
  useEffect(() => {
    if (
      activeUpgrade &&
      activeUpgrade.content &&
      selectionRange &&
      textareaRef.current &&
      selectedText
    ) {
      // selectionRange가 현재 content 범위 내에 유효한지 확인
      const { start, end } = selectionRange;
      if (
        start < 0 ||
        end < 0 ||
        start > content.length ||
        end > content.length ||
        start > end
      ) {
        // 유효하지 않은 범위면 계산하지 않음
        return;
      }

      // TextOverlay에 렌더링되는 텍스트의 실제 위치 계산
      // DOM이 완전히 렌더링된 후 위치를 계산
      const updateModalPosition = () => {
        const selectedTextPart = content.substring(start, end);
        const upgradedText = activeUpgrade.content;
        const beforeText = content.substring(0, start);

        // beforeText + selectedTextPart + "\n" + upgradedText까지의 전체 높이 계산
        const textUpToUpgradeEnd = `${beforeText}${selectedTextPart}\n${upgradedText}`;

        const textarea = textareaRef.current;
        const textareaRect = textarea.getBoundingClientRect();

        // textarea의 스크롤 위치 고려
        const scrollTop = textarea.scrollTop || 0;

        // 전체 텍스트 높이 계산 (업그레이드 결과 텍스트 끝까지)
        const tempElement = document.createElement("div");
        tempElement.style.position = "absolute";
        tempElement.style.visibility = "hidden";
        tempElement.style.width = `${textarea.offsetWidth}px`;
        tempElement.style.fontFamily = '"Pretendard Variable", sans-serif';
        tempElement.style.fontSize = "1.25rem";
        tempElement.style.lineHeight = "1.625rem";
        tempElement.style.padding = "1rem 0";
        tempElement.style.whiteSpace = "pre-wrap";
        tempElement.style.wordWrap = "break-word";
        tempElement.textContent = textUpToUpgradeEnd;

        document.body.appendChild(tempElement);
        const textEndHeight = tempElement.offsetHeight;
        document.body.removeChild(tempElement);

        // Portal을 사용하므로 viewport 기준으로 위치 계산
        // 텍스트 끝의 화면상 위치 = textarea의 상단 위치 + 텍스트 높이 - 스크롤
        const spacing = 0; // 텍스트와 모달 사이 간격
        const textEndTop = textareaRect.top + textEndHeight - scrollTop;
        const newTop = textEndTop + spacing;

        // left 위치는 드래그 시작 위치(start)의 실제 화면 위치
        const newLeft = textareaRect.left;

        // 모달이 화면 밖으로 나가지 않도록 제한
        const estimatedModalWidth = Math.min(
          window.innerWidth * 0.38,
          49.1875 * 16 // 49.1875rem을 px로 변환
        );
        const maxLeft = Math.max(0, window.innerWidth - estimatedModalWidth);
        const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));

        // 모달이 화면 하단을 벗어나지 않도록 제한
        const modalRect = modalRef.current?.getBoundingClientRect();
        const modalHeight = modalRect?.height ?? 0;
        const maxTop = Math.max(0, window.innerHeight - modalHeight);
        const clampedTop = Math.min(newTop, maxTop);

        setModalPosition({
          top: Math.max(0, clampedTop),
          left: clampedLeft,
        });
      };

      // DOM이 완전히 렌더링된 후 위치 계산
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateModalPosition();
        });
      });
    }
  }, [
    activeUpgrade,
    selectionRange,
    selectedText,
    content,
    isResultPanelOpen,
    initialModalPosition,
    modalPosition.left,
  ]);

  // textarea 스크롤 시 모달 위치 업데이트
  useEffect(() => {
    if (!showModal && !activeUpgradeId) return;
    if (!selectionRange || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const { start, end } = selectionRange;

    // 업그레이드 결과가 있는 경우와 없는 경우를 구분하여 처리
    if (activeUpgradeId && activeUpgrade?.content) {
      // 업그레이드 결과가 있는 경우: 기존 updateModalPosition 로직 사용
      const selectedTextPart = content.substring(start, end);
      const upgradedText = activeUpgrade.content;
      const beforeText = content.substring(0, start);
      const textUpToUpgradeEnd = `${beforeText}${selectedTextPart}\n${upgradedText}`;

      const textareaRect = textarea.getBoundingClientRect();
      const scrollTop = textarea.scrollTop || 0;

      const tempElement = document.createElement("div");
      tempElement.style.position = "absolute";
      tempElement.style.visibility = "hidden";
      tempElement.style.width = `${textarea.offsetWidth}px`;
      tempElement.style.fontFamily = '"Pretendard Variable", sans-serif';
      tempElement.style.fontSize = "1.25rem";
      tempElement.style.lineHeight = "1.625rem";
      tempElement.style.padding = "1rem 0";
      tempElement.style.whiteSpace = "pre-wrap";
      tempElement.style.wordWrap = "break-word";
      tempElement.textContent = textUpToUpgradeEnd;

      document.body.appendChild(tempElement);
      const textEndHeight = tempElement.offsetHeight;
      document.body.removeChild(tempElement);

      const spacing = 0;
      const textEndTop = textareaRect.top + textEndHeight - scrollTop;
      const newTop = textEndTop + spacing;
      const newLeft = textareaRect.left;

      const estimatedModalWidth = Math.min(
        window.innerWidth * 0.38,
        49.1875 * 16
      );
      const maxLeft = Math.max(0, window.innerWidth - estimatedModalWidth);
      const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));

      const modalRect = modalRef.current?.getBoundingClientRect();
      const modalHeight = modalRect?.height ?? 0;
      const maxTop = Math.max(0, window.innerHeight - modalHeight);
      const clampedTop = Math.min(newTop, maxTop);

      setModalPosition({
        top: Math.max(0, clampedTop),
        left: clampedLeft,
      });
    } else if (showModal) {
      // 초기 모달 표시 상태: 기존 calculateModalPosition 로직 사용
      const textareaRect = textarea.getBoundingClientRect();
      const textUpToEnd = content.substring(0, end);
      const scrollTop = textarea.scrollTop || 0;

      const tempElement = document.createElement("div");
      tempElement.style.position = "absolute";
      tempElement.style.visibility = "hidden";
      tempElement.style.width = `${textarea.offsetWidth}px`;
      tempElement.style.fontFamily = '"Pretendard Variable", sans-serif';
      tempElement.style.fontSize = "1.25rem";
      tempElement.style.lineHeight = "1.625rem";
      tempElement.style.padding = "1rem 0";
      tempElement.style.whiteSpace = "pre-wrap";
      tempElement.style.wordWrap = "break-word";
      tempElement.textContent = textUpToEnd;

      document.body.appendChild(tempElement);
      const textEndHeight = tempElement.offsetHeight;
      document.body.removeChild(tempElement);

      const spacing = 0;
      const textEndTop = textareaRect.top + textEndHeight - scrollTop;
      const newTop = textEndTop + spacing;
      const newLeft = textareaRect.left;

      const estimatedModalWidth = Math.min(
        window.innerWidth * 0.38,
        49.1875 * 16
      );
      const maxLeft = Math.max(0, window.innerWidth - estimatedModalWidth);
      const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));

      const modalRect = modalRef.current?.getBoundingClientRect();
      const modalHeight = modalRect?.height ?? 0;
      const maxTop = Math.max(0, window.innerHeight - modalHeight);
      const clampedTop = Math.min(newTop, maxTop);

      setModalPosition({
        top: Math.max(0, clampedTop),
        left: clampedLeft,
      });
    }
  }, [
    textareaScrollTop,
    showModal,
    activeUpgradeId,
    selectionRange,
    activeUpgrade,
    content,
    isResultPanelOpen,
  ]);

  const handleUpgradeSubmit = (upgradeRequest) => {
    // 모달 유지되어야 하므로 setShowModal(false) 를 하지 않음
    console.log("업그레이드 전송:", { selectedText, upgradeRequest });
    setIsUpgradeSubmitted(true); // 전송 상태로 변경
    if (onUpgradeRequest && selectionRange) {
      onUpgradeRequest({
        selectedText,
        upgradeRequest,
        selectionRange,
        contentSnapshot: content,
      });
    }
  };

  const handleAcceptUpgrade = (upgradeId) => {
    onAcceptUpgrade?.(upgradeId);
    resetSelectionState();
  };

  const handleCancelUpgrade = (upgradeId) => {
    onCancelUpgrade?.(upgradeId);
    resetSelectionState();
  };

  const handleEditUpgrade = (upgradeId) => {
    onEditUpgrade?.(upgradeId);
    resetSelectionState();
  };

  // 취소선 오버레이를 위한 텍스트 렌더링
  const renderTextWithStrikethrough = () => {
    if (!activeUpgradeId || !activeUpgrade || !selectionRange) return null;

    const { start, end } = selectionRange;
    const beforeText = content.substring(0, start);
    const selectedTextPart = content.substring(start, end);
    const afterText = content.substring(end);
    const upgradedText = activeUpgrade.content;

    return (
      <>
        {beforeText}
        <StrikethroughText>{selectedTextPart}</StrikethroughText>
        {"\n"}
        <UpgradedText>{upgradedText}</UpgradedText>
        {afterText}
      </>
    );
  };

  const renderSelectionHighlight = () => {
    if (!selectionRange) return null;

    const { start, end } = selectionRange;
    const beforeText = content.substring(0, start);
    const selectedTextPart = content.substring(start, end);
    const afterText = content.substring(end);

    // 전송 후 대기 중일 때만 shimmer 효과 적용
    const isWaitingForResponse = isUpgradeSubmitted && !activeUpgradeId;

    return (
      <>
        {beforeText}
        {isWaitingForResponse ? (
          <ShimmerHighlightedText>
            {selectedTextPart.length > 0 ? selectedTextPart : " "}
          </ShimmerHighlightedText>
        ) : (
          <HighlightedText>
            {selectedTextPart.length > 0 ? selectedTextPart : " "}
          </HighlightedText>
        )}
        {afterText}
      </>
    );
  };

  // 삽입된 텍스트 하이라이트 렌더링
  const renderInsertedTextHighlight = () => {
    if (!insertedTextRange) return null;

    const { start, end } = insertedTextRange;
    const beforeText = content.substring(0, start);
    const insertedTextPart = content.substring(start, end);
    const afterText = content.substring(end);

    return (
      <>
        {beforeText}
        <InsertedTextHighlight>{insertedTextPart}</InsertedTextHighlight>
        {afterText}
      </>
    );
  };

  const shouldShowSelectionOverlay = !!(
    showModal &&
    selectionRange &&
    !(activeUpgradeId && activeUpgrade)
  );
  const shouldHideTextareaText =
    showModal || activeUpgradeId || insertedTextRange;

  return (
    <EditorWrapper ref={wrapperRef}>
      {/* {내용이 없을 때만 placeholder를 보여줌} */}
      {content === "" && (
        <FakePlaceholder>
          <p>
            당신만의 고퀄리티 프롬프트를 만들고, 멋진 결과물을 완성해보세요.
          </p>
          <p>Tip.문장을 만들고 드래그 해보세요! 놀라운 일이 펼쳐질 거에요!</p>
        </FakePlaceholder>
      )}

      {/* 드래그 선택 오버레이 */}
      {shouldShowSelectionOverlay && !insertedTextRange && (
        <SelectionOverlay $scrollTop={textareaScrollTop}>
          <div>{renderSelectionHighlight()}</div>
        </SelectionOverlay>
      )}

      {/* 취소선 오버레이 */}
      {activeUpgradeId &&
        activeUpgrade &&
        selectionRange &&
        !insertedTextRange && (
          <TextOverlay $scrollTop={textareaScrollTop}>
            <div>{renderTextWithStrikethrough()}</div>
          </TextOverlay>
        )}

      {/* 삽입된 텍스트 하이라이트 오버레이 */}
      {insertedTextRange && (
        <TextOverlay $scrollTop={textareaScrollTop}>
          <div>{renderInsertedTextHighlight()}</div>
        </TextOverlay>
      )}

      <EditorTextarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange?.(e.target.value)}
        onScroll={(e) => setTextareaScrollTop(e.target.scrollTop)}
        $shouldHideText={shouldHideTextareaText}
      />

      {showModal &&
        createPortal(
          <AIUpgradeModal
            position={modalPosition}
            onSubmit={handleUpgradeSubmit}
            onAcceptUpgrade={handleAcceptUpgrade}
            onCancelUpgrade={handleCancelUpgrade}
            onEditUpgrade={handleEditUpgrade}
            activeUpgradeId={activeUpgradeId}
            modalRef={modalRef}
          />,
          document.body
        )}
    </EditorWrapper>
  );
}

// --- styled-components ---

const EditorWrapper = styled.div`
  width: 100%;
  flex: 1;
  height: 100%;
  position: relative; /* 자식 요소를 겹치기 위해 position: relative 추가 */
  overflow: hidden;
  min-height: 0; /* flex 컨테이너 내에서 스크롤이 작동하도록 */

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

// '가짜' Placeholder를 위한 스타일
const FakePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem 0; /* EditorTextarea와 동일한 패딩 적용 */
  color: #bcbcbc;
  pointer-events: none; /* 중요: 이 요소가 클릭 이벤트를 가로채지 않도록 설정 */
  font-family: "Pretendard Variable", sans-serif;
  line-height: 1.625rem;
  font-size: 1.25rem;
  p {
    margin: 0; /* p 태그의 기본 마진 제거 */
  }

  strong {
    font-weight: 700; /* Tip 부분만 굵게 */
    color: #aaaaaa; /* Tip 부분만 색상을 다르게 (예시) */
  }
`;

const EditorTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: ${(props) => (props.$shouldHideText ? "transparent" : "#001e40")};
  line-height: 1.625rem;
  background: transparent; /* 중요: FakePlaceholder가 비쳐 보이도록 배경을 투명하게 */
  border: none;
  outline: none;
  resize: none; /* resize 핸들 숨기기 */
  padding: 1rem 0;
  position: relative; /* z-index를 주기 위해 추가 */
  z-index: 1; /* FakePlaceholder보다 위에 있도록 설정 */
  caret-color: ${(props) => (props.$shouldHideText ? "#001e40" : "auto")};
  overflow-y: auto;
  overflow-x: hidden;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const SelectionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #001e40;
  line-height: 1.625rem;
  padding: 1rem 0;
  pointer-events: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 2;
  overflow: hidden;
  box-sizing: border-box;

  /* 오버레이 내용을 textarea의 스크롤 위치에 맞춰 조정 */
  > div {
    transform: translateY(-${(props) => props.$scrollTop || 0}px);
  }
`;

const HighlightedText = styled.span`
  background-color: #b6dcfd;
  opacity: 0.8;
`;

const ShimmerHighlightedText = styled.span`
  background: linear-gradient(
    90deg,
    #a6a6a6 0%,
    #a6a6a6 30%,
    #49d8ff 50%,
    #269aed 70%,
    #a6a6a6 100%
  );
  font-weight: bold;
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: textShimmer 8s ease-in-out;

  @keyframes textShimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #001e40;
  line-height: 1.625rem;
  padding: 1rem 0;
  pointer-events: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 3;
  box-sizing: border-box;

  /* 오버레이 내용을 textarea의 스크롤 위치에 맞춰 조정 */
  > div {
    transform: translateY(-${(props) => props.$scrollTop || 0}px);
  }
`;

const StrikethroughText = styled.span`
  text-decoration: line-through;
  text-decoration-color: #a6a6a6;
  text-decoration-thickness: 0.1rem;
  color: #a6a6a6;
`;

const UpgradedText = styled.span`
  color: #001e40;
  background-color: rgba(182, 220, 253, 0.7);
  padding: 0.1rem 0.2rem;
  border-radius: 0.2rem;
`;

const InsertedTextHighlight = styled.span`
  color: #00aeff;
`;
