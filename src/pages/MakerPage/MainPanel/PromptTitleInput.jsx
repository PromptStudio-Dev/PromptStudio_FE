import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import styled from "styled-components";

export default function PromptTitleInput({ value = "", onChange }) {
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const measureRef = useRef(null);

  // "새로운 프롬프트"인지 확인
  const isDefaultTitle = value === "새로운 프롬프트";

  // 내부 input 값: "새로운 프롬프트"면 빈 문자열, 아니면 실제 값
  const [inputValue, setInputValue] = useState(isDefaultTitle ? "" : value);
  const prevValueRef = useRef(value);
  const isUserTypingRef = useRef(false);

  // value prop이 외부에서 변경될 때만 inputValue 동기화
  useEffect(() => {
    // value가 실제로 변경되었고, 사용자가 입력 중이 아닐 때만 동기화
    if (prevValueRef.current !== value && !isUserTypingRef.current) {
      if (isDefaultTitle) {
        // "새로운 프롬프트"로 변경되면 빈 문자열로
        setInputValue("");
      } else {
        // "새로운 프롬프트"가 아니면 value로 동기화
        setInputValue(value);
      }
      prevValueRef.current = value;
    }
    // 동기화 후 사용자 입력 플래그 리셋
    isUserTypingRef.current = false;
  }, [value, isDefaultTitle]);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (measureRef.current) {
        setUnderlineWidth(measureRef.current.offsetWidth);
      }
    };
    updateWidth();

    let observer;
    if (typeof ResizeObserver !== "undefined" && measureRef.current) {
      observer = new ResizeObserver(updateWidth);
      observer.observe(measureRef.current);
    } else {
      window.addEventListener("resize", updateWidth);
    }
    return () => {
      if (observer) {
        observer.disconnect();
        window.removeEventListener("resize", updateWidth);
      }
    };
  }, [inputValue, isDefaultTitle]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // 사용자가 입력하는 순간 바로 onChange 호출
    isUserTypingRef.current = true;
    onChange?.(newValue);
  };

  // MeasureText에 표시할 텍스트: inputValue가 있으면 inputValue, 없으면 placeholder
  const displayText = inputValue || "프롬프트 제목을 입력하세요.";

  return (
    <TitleInputWrapper>
      <MeasureText ref={measureRef}>{displayText}</MeasureText>
      <TitleInput
        type="text"
        placeholder="프롬프트 제목을 입력하세요."
        value={inputValue}
        onChange={handleChange}
      />
      <Underline $width={underlineWidth} />
    </TitleInputWrapper>
  );
}

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
  font-size: 1.625rem;
  font-weight: 600;
  pointer-events: none;
`;

const TitleInput = styled.input`
  width: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.625rem;
  font-weight: 600;
  color: #aadff7;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.46vh 0;

  &::placeholder {
    color: #aadff7;
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
