import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import NextButtonIconImage from "./assets/nextButtonIcon.svg";

export default function UploadTemplatePage({ onNext }) {
  const [content, setContent] = useState("");
  const [showInputBlock, setShowInputBlock] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [blockPosition, setBlockPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState({
    start: 0,
    end: 0,
    text: "",
  });
  const [highlightPosition, setHighlightPosition] = useState(null);
  const textareaRef = useRef(null);
  const inputBlockRef = useRef(null);
  const highlightRef = useRef(null);

  const calculateHighlightPosition = (textarea, start, end) => {
    // textarea의 스타일 정보 가져오기
    const computedStyle = window.getComputedStyle(textarea);
    const textareaRect = textarea.getBoundingClientRect();
    const scrollTop = textarea.scrollTop;
    const scrollLeft = textarea.scrollLeft;

    // 임시 div를 생성하여 textarea와 동일한 스타일로 텍스트 렌더링
    const mirror = document.createElement("div");
    const mirrorStyle = mirror.style;

    // textarea와 동일한 스타일 적용
    mirrorStyle.position = "absolute";
    mirrorStyle.visibility = "hidden";
    mirrorStyle.whiteSpace = "pre-wrap";
    mirrorStyle.wordWrap = "break-word";
    mirrorStyle.font = computedStyle.font;
    mirrorStyle.fontSize = computedStyle.fontSize;
    mirrorStyle.fontFamily = computedStyle.fontFamily;
    mirrorStyle.fontWeight = computedStyle.fontWeight;
    mirrorStyle.lineHeight = computedStyle.lineHeight;
    mirrorStyle.padding = computedStyle.padding;
    mirrorStyle.border = computedStyle.border;
    mirrorStyle.width = `${textarea.offsetWidth}px`;
    mirrorStyle.boxSizing = computedStyle.boxSizing;

    // 텍스트를 줄 단위로 분리하여 각 줄을 span으로 감싸기
    const allLines = textarea.value.split("\n");
    const textBeforeStart = textarea.value.substring(0, start);
    const textBeforeEnd = textarea.value.substring(0, end);
    const linesBeforeStart = textBeforeStart.split("\n");
    const linesBeforeEnd = textBeforeEnd.split("\n");

    const startLine = linesBeforeStart.length - 1;
    const endLine = linesBeforeEnd.length - 1;
    const startChar = linesBeforeStart[linesBeforeStart.length - 1].length;
    const endChar = linesBeforeEnd[linesBeforeEnd.length - 1].length;

    // 각 줄을 처리
    allLines.forEach((line, lineIndex) => {
      const lineSpan = document.createElement("span");
      lineSpan.style.display = "block";

      if (lineIndex === startLine && lineIndex === endLine) {
        // 한 줄 내 선택
        const before = line.substring(0, startChar);
        const selected = line.substring(startChar, endChar);
        const after = line.substring(endChar);

        lineSpan.innerHTML = `${escapeHtml(
          before
        )}<mark style="background: transparent; border: 2px solid red;">${escapeHtml(
          selected
        )}</mark>${escapeHtml(after)}`;
      } else if (lineIndex === startLine) {
        // 첫 줄 (일부 선택)
        const before = line.substring(0, startChar);
        const selected = line.substring(startChar);

        lineSpan.innerHTML = `${escapeHtml(
          before
        )}<mark style="background: transparent; border: 2px solid red;">${escapeHtml(
          selected
        )}</mark>`;
      } else if (lineIndex === endLine) {
        // 마지막 줄 (일부 선택)
        const selected = line.substring(0, endChar);
        const after = line.substring(endChar);

        lineSpan.innerHTML = `<mark style="background: transparent; border: 2px solid red;">${escapeHtml(
          selected
        )}</mark>${escapeHtml(after)}`;
      } else if (lineIndex > startLine && lineIndex < endLine) {
        // 중간 줄 (전체 선택)
        lineSpan.innerHTML = `<mark style="background: transparent; border: 2px solid red;">${escapeHtml(
          line
        )}</mark>`;
      } else {
        // 선택되지 않은 줄
        lineSpan.textContent = line;
      }

      mirror.appendChild(lineSpan);
    });

    document.body.appendChild(mirror);

    // 선택된 부분의 mark 요소 찾기
    const marks = mirror.querySelectorAll("mark");
    if (marks.length === 0) {
      document.body.removeChild(mirror);
      return null;
    }

    // 첫 번째 mark의 위치 계산
    const firstMark = marks[0];
    const firstMarkRect = firstMark.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();

    // 전체 선택 영역의 너비 계산 (여러 줄인 경우)
    let maxWidth = 0;
    let totalHeight = 0;

    marks.forEach((mark) => {
      const markRect = mark.getBoundingClientRect();
      maxWidth = Math.max(maxWidth, markRect.width);
      totalHeight += markRect.height;
    });

    // textarea의 실제 위치와 비교하여 조정
    const top =
      textareaRect.top + (firstMarkRect.top - mirrorRect.top) - scrollTop;
    const left =
      textareaRect.left + (firstMarkRect.left - mirrorRect.left) - scrollLeft;
    const width = endLine === startLine ? firstMarkRect.width : maxWidth;
    const height = endLine === startLine ? firstMarkRect.height : totalHeight;

    document.body.removeChild(mirror);

    return {
      top,
      left,
      width,
      height,
    };
  };

  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  const handleMouseUp = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 이미 블록이 열려있으면 먼저 닫기
    if (showInputBlock) {
      handleCancel();
      // 약간의 지연 후 새로운 선택 처리 (이벤트 전파 완료 대기)
      setTimeout(() => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);

        if (selected.length > 0) {
          const top = e.clientY + 10;
          const left = e.clientX;
          const highlightPos = calculateHighlightPosition(textarea, start, end);

          setBlockPosition({ top, left });
          setSelectedText({ start, end, text: selected });
          setHighlightPosition(highlightPos);
          setInputValue("");
          setShowInputBlock(true);
        }
      }, 0);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    if (selected.length > 0) {
      // 마우스 포인터 위치를 뷰포트 기준 좌표로 사용
      const top = e.clientY + 10; // 마우스 포인터 아래 10px
      const left = e.clientX; // 마우스 포인터 X 좌표
      const highlightPos = calculateHighlightPosition(textarea, start, end);

      setBlockPosition({ top, left });
      setSelectedText({ start, end, text: selected });
      setHighlightPosition(highlightPos);
      setInputValue("");
      setShowInputBlock(true);
    }
  };

  const handleConfirm = () => {
    if (!inputValue.trim()) {
      // 빈 텍스트면 취소
      handleCancel();
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const newText = `[${inputValue}]`;
    const before = content.substring(0, selectedText.start);
    const after = content.substring(selectedText.end);
    const updatedContent = before + newText + after;

    setContent(updatedContent);
    setShowInputBlock(false);
    setInputValue("");
    setHighlightPosition(null);

    // 커서 위치 조정
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = selectedText.start + newText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const handleCancel = () => {
    setShowInputBlock(false);
    setInputValue("");
    setHighlightPosition(null);
    // 포커스를 제거하지 않고 그대로 유지
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    if (!showInputBlock) return;

    const handleClickOutside = (e) => {
      if (
        inputBlockRef.current &&
        !inputBlockRef.current.contains(e.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target)
      ) {
        handleCancel();
      }
    };

    // mousedown과 click 이벤트 모두 처리
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [showInputBlock]);

  return (
    <UploadTemplateWrapper>
      <Title>프롬프트 템플릿</Title>
      <Explain>
        [주제], [자기소개서 초안] 처럼 다른 사용자들에게 입력 받고 싶은 항목을
        대괄호로 감싸주세요.
      </Explain>
      <ContentInputWrapper>
        <ContentInput
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onMouseUp={handleMouseUp}
          placeholder="프롬프트 템플릿을 입력해주세요."
        />
        {showInputBlock && highlightPosition && (
          <HighlightOverlay
            ref={highlightRef}
            style={{
              top: `${highlightPosition.top}px`,
              left: `${highlightPosition.left}px`,
              width: `${highlightPosition.width}px`,
              height: `${highlightPosition.height}px`,
            }}
          />
        )}
      </ContentInputWrapper>
      {showInputBlock && (
        <InputBlock
          ref={inputBlockRef}
          style={{
            top: `${blockPosition.top}px`,
            left: `${blockPosition.left}px`,
          }}
        >
          <InputField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="항목 이름을 입력하세요"
            autoFocus
          />
        </InputBlock>
      )}
      <NextButton onClick={onNext}>
        <NextButtonText>다음</NextButtonText>
        <NextButtonIcon src={NextButtonIconImage} />
      </NextButton>
    </UploadTemplateWrapper>
  );
}

const NextButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: #f3f3f3;
  padding: 0.72rem 1rem;
  border: none;
  align-self: flex-end;
  margin-top: 1rem;
`;

const NextButtonText = styled.span`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
  margin-right: 0.2rem;
`;

const NextButtonIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  display: block;
  flex-shrink: 0;
`;

const UploadTemplateWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.h1`
  color: var(--B-Blue-line, #00aeff);
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.02rem;
  margin-bottom: 1.5rem;
`;

const Explain = styled.span`
  color: var(--B-T, #454545);
  font-family: Pretendard;
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.014375rem;
  margin-left: 1rem;
  margin-bottom: 1.5rem;
`;

const ContentInputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 5.06rem;
`;

const ContentInput = styled.textarea`
  width: 100%;
  height: 35vh;
  border-radius: 1rem;
  padding: 1.94rem 2.44rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
  resize: none;
  vertical-align: top;
  outline: none;
  font-family: Pretendard;
  font-size: 1.4375rem;

  &:focus {
    border: 0.125rem solid var(--Light-blue, #49d8ff);
    outline: none;
  }
`;

const HighlightOverlay = styled.div`
  position: fixed;
  background-color: rgba(0, 174, 255, 0.2);
  border: 0.125rem solid var(--B-Blue-line, #00aeff);
  border-radius: 0.25rem;
  pointer-events: none;
  z-index: 999;
`;

const InputBlock = styled.div`
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
  pointer-events: auto;
`;

const InputField = styled.input`
  width: 20rem;
  padding: 0.75rem 1rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
  border-radius: 0.5rem;
  font-family: Pretendard;
  font-size: 1.25rem;
  outline: none;

  &:focus {
    border: 0.125rem solid var(--B-Blue-line, #00aeff);
  }
`;
