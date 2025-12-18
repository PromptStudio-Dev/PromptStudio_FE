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
  const [prevActiveUpgradeId, setPrevActiveUpgradeId] = useState(null);
  const [isUpgradeSubmitted, setIsUpgradeSubmitted] = useState(false); // 업그레이드 전송 여부
  const [isReupgrading, setIsReupgrading] = useState(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [upgradeIdToCancel, setUpgradeIdToCancel] = useState(null);
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);
  const isMouseDownInTextareaRef = useRef(false);

  const resetSelectionState = useCallback(() => {
    setShowModal(false);
    setSelectionRange(null);
    setSelectedText("");
    setIsUpgradeSubmitted(false);
    setIsReupgrading(false);
  }, []);

  // insertedTextRange가 설정되면 shimmer 효과 제거
  useEffect(() => {
    if (insertedTextRange) {
      setIsUpgradeSubmitted(false);
      setShowModal(false);
    }
  }, [insertedTextRange]);

  // activeUpgradeId 변화 감지 - 값이 있다가 null이 되면 (취소/거절) 모달 닫기
  useEffect(() => {
    // 이전에 activeUpgradeId가 있었는데, 지금 null이 되었고, 업그레이드 전송 상태였다면
    // -> 취소/거절로 판단
    if (
      prevActiveUpgradeId !== null &&
      activeUpgradeId === null &&
      isUpgradeSubmitted
    ) {
      resetSelectionState();
    }

    // 현재 activeUpgradeId를 이전 값으로 저장
    setPrevActiveUpgradeId(activeUpgradeId);
  }, [
    activeUpgradeId,
    isUpgradeSubmitted,
    prevActiveUpgradeId,
    resetSelectionState,
  ]);

  // 업그레이드 내용이 변경되면 재업그레이드 완료
  useEffect(() => {
    if (activeUpgrade?.content && isReupgrading) {
      setIsReupgrading(false);
    }
  }, [activeUpgrade?.content, isReupgrading]);

  const processSelectionRange = useCallback(
    (start, end) => {
      if (start === end) return;
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Windows CRLF 보정
      let safeEnd = end;
      if (content.slice(end - 2, end) === "\r\n" && end < content.length) {
        safeEnd = end + 1;
      }

      if (activeUpgradeId) {
        const isDifferentSelection =
          !activeUpgrade ||
          !activeUpgrade.selectionRange ||
          activeUpgrade.selectionRange.start !== start ||
          activeUpgrade.selectionRange.end !== safeEnd;

        if (isDifferentSelection) {
          setUpgradeIdToCancel(activeUpgradeId);
          setIsDeleteModalOpen(true);
          return;
        }
      }

      const draggedText = content.substring(start, safeEnd);
      const trimmedText = draggedText.trim();

      if (trimmedText.length >= 40) {
        setSelectedText(draggedText);
        setSelectionRange({ start, end: safeEnd });

        const calculateModalPosition = () => {
          const textareaRect = textarea.getBoundingClientRect();
          const textUpToEnd = content.substring(0, safeEnd);
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

        setShowModal(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            calculateModalPosition();
          });
        });
      } else {
        resetSelectionState();
      }
    },
    [
      activeUpgrade,
      activeUpgradeId,
      content,
      resetSelectionState,
      setModalPosition,
      setInitialModalPosition,
    ]
  );

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

    // 브라우저가 selection을 확정할 시간을 주고 다시 체크
    setTimeout(() => {
      processSelectionRange(textarea.selectionStart, textarea.selectionEnd);
    }, 10);
  }, [isUpgradeSubmitted, activeUpgradeId, processSelectionRange]);

  const handleMouseDown = useCallback(
    (e) => {
      // 로딩 중엔 아무 것도 못 하게 (그대로 유지)
      if (isUpgradeLoading) return;

      // 모달은 ㄱㅊ
      if (modalRef.current?.contains(e.target)) {
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) return;

      const isInsideTextarea =
        textarea.contains(e.target) || textarea === e.target;
      isMouseDownInTextareaRef.current = isInsideTextarea;

      // textarea 밖 클릭
      if (!isInsideTextarea) {
        // 모달만 떠 있고 업그레이드 결과는 없으면 -> 그냥 닫기
        if (showModal && !activeUpgradeId) {
          resetSelectionState();
        }
        return;
      }

      // textarea 안 클릭
      if (showModal) {
        if (activeUpgradeId) {
          // 업그레이드 결과가 있을 때만 삭제 확인
          setUpgradeIdToCancel(activeUpgradeId);
          setIsDeleteModalOpen(true);
        } else {
          // 전송 전 상태면 그냥 닫기
          resetSelectionState();
        }
      }
    },
    [showModal, activeUpgradeId, isUpgradeLoading, resetSelectionState]
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

  // Ctrl/Cmd + A 전체 선택 시에도 드래그 선택 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isSelectAll =
        (e.key === "a" || e.key === "A") && (e.ctrlKey || e.metaKey);
      if (!isSelectAll) return;
      if (isUpgradeLoading) return;

      const textarea = textareaRef.current;
      if (!textarea) return;
      if (document.activeElement !== textarea) return;

      requestAnimationFrame(() => {
        processSelectionRange(textarea.selectionStart, textarea.selectionEnd);
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isUpgradeLoading, processSelectionRange]);

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

  const handleUpgradeSubmit = async (upgradeRequest) => {
    setIsUpgradeLoading(true); //  로딩 시작
    setIsUpgradeSubmitted(true);

    try {
      await onUpgradeRequest({
        selectedText,
        upgradeRequest,
        selectionRange,
        contentSnapshot: content,
      });
    } finally {
      setIsUpgradeLoading(false); // 결과 오면 로딩 종료
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
    const isWaitingForResponse = isUpgradeLoading;

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
    (!activeUpgradeId || !activeUpgrade || isUpgradeLoading)
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
        !insertedTextRange &&
        !isUpgradeLoading && (
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
            isLoading={isUpgradeLoading}
            isReupgrading={isReupgrading}
            modalRef={modalRef}
          />,
          document.body
        )}

      {isDeleteModalOpen &&
        createPortal(
          <DeleteModalOverlay onClick={() => setIsDeleteModalOpen(false)}>
            <DeleteModalContainer onClick={(e) => e.stopPropagation()}>
              <DeleteModalText>변경 사항을 삭제하시겠습니까?</DeleteModalText>
              <DeleteModalButtonGroup>
                <DeleteModalCancelButton
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUpgradeIdToCancel(null);
                  }}
                >
                  아니오
                </DeleteModalCancelButton>
                <DeleteModalConfirmButton
                  onClick={() => {
                    if (upgradeIdToCancel) {
                      onCancelUpgrade?.(upgradeIdToCancel);
                      resetSelectionState();
                    }
                    setIsDeleteModalOpen(false);
                    setUpgradeIdToCancel(null);
                  }}
                >
                  삭제
                </DeleteModalConfirmButton>
              </DeleteModalButtonGroup>
            </DeleteModalContainer>
          </DeleteModalOverlay>,
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
  font-weight: bold;
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

const DeleteModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const DeleteModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.625rem 3.0625rem 1.125rem 3.625rem;
  border-radius: 1rem;
  background: #282828;
`;

const DeleteModalText = styled.div`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const DeleteModalButtonGroup = styled.div`
  display: flex;
  gap: 1.125rem;
  align-items: center;
`;

const DeleteModalCancelButton = styled.button`
  display: flex;
  width: 5rem;
  height: 1.8125rem;
  padding: 0.375rem 0.625rem;
  justify-content: center;
  align-items: center;
  border-radius: 7.5rem;
  border: 0.0313rem solid #fff;
  background: transparent;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const DeleteModalConfirmButton = styled.button`
  display: flex;
  width: 4rem;
  height: 1.8125rem;
  padding: 0.375rem 0.625rem;
  justify-content: center;
  align-items: center;
  border-radius: 7.5rem;
  border: 0.0313rem solid #fff;
  background: #fff;
  color: #282828;
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;
