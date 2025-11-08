import React, { useState, useRef } from "react";
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
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState(null);
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  const resetSelectionState = () => {
    setShowModal(false);
    setSelectionRange(null);
    setSelectedText("");
  };

  const handleMouseUp = (event) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const draggedText = content.substring(start, end);
    const trimmedText = draggedText.trim();

    if (trimmedText.length >= 40) {
      // 드래그한 텍스트 저장 (40자 이상일 때만)
      setSelectedText(draggedText);
      setSelectionRange({ start, end });
      console.log("드래그된 텍스트:", draggedText);

      const wrapperRect = wrapperRef.current?.getBoundingClientRect();
      const textareaRect = textarea.getBoundingClientRect();
      const cursorX = event.clientX;
      const cursorY = event.clientY;

      if (wrapperRect) {
        const relativeTop = cursorY - wrapperRect.top + 12;
        const estimatedModalWidth = Math.min(
          wrapperRect.width,
          window.innerWidth * 0.38
        );
        const maxLeft = Math.max(0, wrapperRect.width - estimatedModalWidth);
        const relativeLeft =
          cursorX - wrapperRect.left - estimatedModalWidth / 2;
        const clampedLeft = Math.max(0, Math.min(relativeLeft, maxLeft));

        setModalPosition({
          top: Math.max(0, relativeTop),
          left: clampedLeft,
        });
      } else {
        // fallback: 텍스트 영역 기준
        const relativeTop = cursorY - textareaRect.top + 12;
        const relativeLeft =
          cursorX - textareaRect.left - textareaRect.width * 0.19;

        setModalPosition({
          top: Math.max(0, relativeTop),
          left: Math.max(0, relativeLeft),
        });
      }
      setShowModal(true);
    } else {
      setShowModal(false);
      setSelectionRange(null);
      setSelectedText("");
    }
  };

  const handleMouseDown = () => {
    // 마우스를 누르면 모달 숨김 (새로운 선택 시작)
    setShowModal(false);
  };

  const handleUpgradeSubmit = (upgradeRequest) => {
    // 모달 유지되어야 하므로 setShowModal(false) 를 하지 않음
    console.log("업그레이드 전송:", { selectedText, upgradeRequest });
    if (onUpgradeRequest && selectionRange) {
      onUpgradeRequest({
        selectedText,
        upgradeRequest,
        selectionRange,
        contentSnapshot: content,
      });

      // 한 번 더 호출해 offset만큼 아래로 내려줌 (offset은 임의로 설정, 디자인과 논의 후 변경 예정)
      setModalPosition((prev) => {
        const offset = 16;
        const wrapperRect = wrapperRef.current?.getBoundingClientRect();
        const modalRect = modalRef.current?.getBoundingClientRect();
        const modalHeight = modalRect?.height ?? 0;

        if (!wrapperRect) {
          return {
            top: Math.max(0, prev.top + offset),
            left: prev.left,
          };
        }

        const maxTop = Math.max(0, wrapperRect.height - modalHeight - offset);

        return {
          top: Math.min(prev.top + offset, maxTop),
          left: prev.left,
        };
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

    return (
      <>
        {beforeText}
        <HighlightedText>
          {selectedTextPart.length > 0 ? selectedTextPart : " "}
        </HighlightedText>
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
    shouldShowSelectionOverlay ||
    (activeUpgradeId && activeUpgrade && selectionRange);

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
      {shouldShowSelectionOverlay && (
        <SelectionOverlay>{renderSelectionHighlight()}</SelectionOverlay>
      )}

      {/* 취소선 오버레이 */}
      {activeUpgradeId && activeUpgrade && selectionRange && (
        <TextOverlay>{renderTextWithStrikethrough()}</TextOverlay>
      )}

      <EditorTextarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange?.(e.target.value)}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        $shouldHideText={shouldHideTextareaText}
      />

      {showModal && (
        <AIUpgradeModal
          position={modalPosition}
          onSubmit={handleUpgradeSubmit}
          onAcceptUpgrade={handleAcceptUpgrade}
          onCancelUpgrade={handleCancelUpgrade}
          onEditUpgrade={handleEditUpgrade}
          activeUpgradeId={activeUpgradeId}
          modalRef={modalRef}
        />
      )}
    </EditorWrapper>
  );
}

// --- styled-components ---

const EditorWrapper = styled.div`
  width: 100%;
  min-height: 40vh;
  margin-top: 2vh;
  position: relative; /* 자식 요소를 겹치기 위해 position: relative 추가 */
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
  line-height: 1.5;
  font-size: 1.4375rem;
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
  min-height: 40vh;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.44rem;
  font-weight: 400;
  color: ${(props) => (props.$shouldHideText ? "transparent" : "#001e40")};
  line-height: 1.5;
  background: transparent; /* 중요: FakePlaceholder가 비쳐 보이도록 배경을 투명하게 */
  border: none;
  outline: none;
  resize: vertical;
  padding: 1rem 0;
  position: relative; /* z-index를 주기 위해 추가 */
  z-index: 1; /* FakePlaceholder보다 위에 있도록 설정 */
  caret-color: ${(props) => (props.$shouldHideText ? "#001e40" : "auto")};
`;

const SelectionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 40vh;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.44rem;
  font-weight: 400;
  color: #001e40;
  line-height: 1.5;
  padding: 1rem 0;
  pointer-events: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 2;
`;

const HighlightedText = styled.span`
  background-color: rgba(120, 172, 255, 0.35);
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 40vh;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.44rem;
  font-weight: 400;
  color: #001e40;
  line-height: 1.5;
  padding: 1rem 0;
  pointer-events: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 3;
`;

const StrikethroughText = styled.span`
  text-decoration: line-through;
  text-decoration-color: #a6a6a6;
  text-decoration-thickness: 0.1rem;
  color: #a6a6a6;
  background-color: rgba(120, 172, 255, 0.35);
`;

const UpgradedText = styled.span`
  color: #001e40;
  background-color: rgba(170, 223, 247, 0.4);
  font-weight: 600;
  padding: 0.1rem 0.2rem;
  border-radius: 0.2rem;
`;
