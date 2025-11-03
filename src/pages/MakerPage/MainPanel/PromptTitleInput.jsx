import React, { useState, useRef, useLayoutEffect } from "react";
import styled from "styled-components";

function PromptTitleInput() {
  const [title, setTitle] = useState("");
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const measureRef = useRef(null);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setUnderlineWidth(measureRef.current.offsetWidth);
    }
  }, [title]);

  return (
    <TitleInputWrapper>
      <MeasureText ref={measureRef}>
        {title || "프롬프트 제목을 입력하세요."}
      </MeasureText>
      <TitleInput
        type="text"
        placeholder="프롬프트 제목을 입력하세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Underline $width={underlineWidth} />
    </TitleInputWrapper>
  );
}

export default PromptTitleInput;

const TitleInputWrapper = styled.div`
  width: 100%;
  max-width: 35vw; /* 758px @ 1920px */
  position: relative;
`;

const MeasureText = styled.div`
  position: absolute;
  visibility: hidden;
  white-space: pre;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.88vw; /* 36px @ 1920px */
  font-weight: 600;
  pointer-events: none;
`;

const TitleInput = styled.input`
  width: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.88vw; /* 36px @ 1920px */
  font-weight: 600;
  color: #aadff7;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.46vh 0;

  &::placeholder {
    color: #e1e1e0;
  }

  &:focus {
    color: #aadff7;
  }
`;

const Underline = styled.div`
  width: ${(props) => (props.$width ? `${props.$width}px` : "20.89vw")};
  max-width: 35vw; /* 758px @ 1920px */
  height: 0.19vh; /* 2px @ 1080px */
  background-color: #aadff7;
  margin-top: 0.46vh;
  transition: width 0.3s ease;
`;
