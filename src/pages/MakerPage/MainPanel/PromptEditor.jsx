import React, { useState, useRef } from "react";
import styled from "styled-components";
import PromptUpgradeIcon from "../../../assets/icon/prompt-upgrade-icon.svg";

function PromptEditor() {
  const [content, setContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);

  const handleMouseUp = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (selectedText.trim().length > 0) {
      const style = getComputedStyle(textarea);
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
      const paddingTop = parseFloat(style.paddingTop);

      // end는 항상 커서가 끝나는 위치 (드래그 방향 무관)
      // 선택 영역이 끝나는 줄 번호 계산 (0-based)
      const textBeforeEnd = content.substring(0, end);
      const endLineNumber = textBeforeEnd.split("\n").length - 1;

      // Y 위치: 선택된 줄의 다음 줄 위치 + 8px 간격
      const topPosition = paddingTop + (endLineNumber + 1) * lineHeight + 8;

      setModalPosition({
        top: topPosition,
        left: 0, // 항상 왼쪽에 고정
      });
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const handleMouseDown = () => {
    // 마우스를 누르면 모달 숨김 (새로운 선택 시작)
    setShowModal(false);
  };

  return (
    <EditorWrapper>
      {/* 3. 내용이 없을 때만 FakePlaceholder를 보여줍니다. */}
      {content === "" && (
        <FakePlaceholder>
          <p>
            당신만의 고퀄리티 프롬프트를 만들고, 멋진 결과물을 완성해보세요.
          </p>
          <p>Tip.문장을 만들고 드래그 해보세요! 놀라운 일이 펼쳐질 거에요!</p>
        </FakePlaceholder>
      )}
      <EditorTextarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      />

      {showModal && (
        <SelectionModal
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
          }}
        >
          <LeftSection>
            <LeftButton>AI 맞춤 추천</LeftButton>
          </LeftSection>
          <MiddleSection>
            <ButtonIcon src={PromptUpgradeIcon} alt="업그레이드" />
            <MiddleText>AI 사용으로 업그레이드 하기</MiddleText>
          </MiddleSection>
        </SelectionModal>
      )}
    </EditorWrapper>
  );
}

export default PromptEditor;

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
  color: #001e40;
  line-height: 1.5;
  background: transparent; /* 중요: FakePlaceholder가 비쳐 보이도록 배경을 투명하게 */
  border: none;
  outline: none;
  resize: vertical;
  padding: 1rem 0;
  position: relative; /* z-index를 주기 위해 추가 */
  z-index: 1; /* FakePlaceholder보다 위에 있도록 설정 */
`;

const SelectionModal = styled.div`
  position: absolute;
  display: flex;
  width: 40.99vw; /* 787px @ 1920px */
  height: 4.26vh; /* 46px @ 1080px */
  border: 0.16vw solid #49d8ff; /* 3px @ 1920px */
  border-radius: 0.42vw; /* 8px @ 1920px */
  background: #fff;
  overflow: hidden;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-0.37vh);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LeftSection = styled.div`
  width: 7.55vw; /* 145px @ 1920px */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 0.16vw solid #49d8ff; /* 3px @ 1920px */
`;

const LeftButton = styled.button`
  background: transparent;
  border: none;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.83vw; /* 16px @ 1920px */
  font-weight: 500;
  color: #454545;
  cursor: pointer;
  white-space: nowrap;
`;

const MiddleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.83vw; /* 16px @ 1920px */
`;

const MiddleText = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.83vw; /* 16px @ 1920px */
  font-weight: 500;
  color: #848484;
  white-space: nowrap;
`;

const ButtonIcon = styled.img`
  width: 1.25vw; /* 24px @ 1920px */
  height: 2.22vh; /* 24px @ 1080px */
`;
