import React, { useState } from "react";
import styled from "styled-components";

function PromptEditor() {
  const [content, setContent] = useState("");

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
        // 기존 placeholder 속성 제거
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
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
