import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

export default function UploadTemplatePage({
  content,
  setContent,
  imageRequired,
  setImageRequired,
}) {
  const [showInputBlock, setShowInputBlock] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [blockPosition, setBlockPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState({
    start: 0,
    end: 0,
    text: "",
  });
  const textareaRef = useRef(null);
  const inputBlockRef = useRef(null);
  const inputFieldRef = useRef(null);
  const textOverlayRef = useRef(null);
  const contentInputWrapperRef = useRef(null);

  const handleImageRequiredChange = (value) => {
    setImageRequired(value);
  };

  const handleMouseUp = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 이미 블록이 열려있으면 먼저 닫기
    if (showInputBlock) {
      handleCancel();
      // 약간의 지연 후 새로운 선택 처리 (이벤트 전파 완료 대기)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selected = textarea.value.substring(start, end);

          if (selected.length > 0) {
            const top = e.clientY + 10;
            const left = e.clientX;

            setBlockPosition({ top, left });
            setSelectedText({ start, end, text: selected });
            setInputValue("");
            setShowInputBlock(true);

            // selection 유지 후 input에 포커스
            setTimeout(() => {
              // selection을 먼저 설정
              textarea.setSelectionRange(start, end);
              // 그 다음 input에 포커스
              inputFieldRef.current?.focus();
            }, 0);
          }
        });
      });
      return;
    }

    // 브라우저가 selection을 완전히 업데이트할 때까지 대기
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);

        if (selected.length > 0) {
          // 마우스 포인터 위치를 뷰포트 기준 좌표로 사용
          const top = e.clientY + 10; // 마우스 포인터 아래 10px
          const left = e.clientX; // 마우스 포인터 X 좌표

          setBlockPosition({ top, left });
          setSelectedText({ start, end, text: selected });
          setInputValue("");
          setShowInputBlock(true);

          // input에 자동 포커스
          setTimeout(() => {
            inputFieldRef.current?.focus();
          }, 0);
        }
      });
    });
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
    // 포커스를 제거하지 않고 그대로 유지
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
  };

  // ContentInput의 높이를 동적으로 조정하고 TextOverlay와 동기화
  useEffect(() => {
    const textarea = textareaRef.current;
    const textOverlay = textOverlayRef.current;
    if (!textarea) return;

    // 최소 높이 설정
    const minHeight = window.innerHeight * 0.35;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.max(scrollHeight, minHeight);
    textarea.style.height = `${newHeight}px`;

    // TextOverlay의 높이도 동일하게 설정
    if (textOverlay) {
      textOverlay.style.height = `${newHeight}px`;
    }
  }, [content]);

  // ContentInputWrapper 스크롤 시 inputBlock 닫기
  useEffect(() => {
    const wrapper = contentInputWrapperRef.current;
    if (!wrapper) return;

    const handleWrapperScroll = () => {
      if (showInputBlock) {
        handleCancel();
      }
    };

    wrapper.addEventListener("scroll", handleWrapperScroll);
    return () => {
      wrapper.removeEventListener("scroll", handleWrapperScroll);
    };
  }, [showInputBlock]);

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
      <ContentInputWrapper ref={contentInputWrapperRef}>
        <TextOverlay ref={textOverlayRef}>
          {content.substring(0, selectedText.start)}
          {showInputBlock && (
            <HighlightedText>
              {content.substring(selectedText.start, selectedText.end)}
            </HighlightedText>
          )}
          {!showInputBlock &&
            content.substring(selectedText.start, selectedText.end)}
          {content.substring(selectedText.end)}
        </TextOverlay>
        <ContentInput
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onMouseUp={handleMouseUp}
          placeholder="프롬프트 템플릿을 입력해주세요."
        />
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
            ref={inputFieldRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="항목 이름을 입력하세요"
          />
        </InputBlock>
      )}
      <CheckImageRequiredSection>
        <CheckImageRequiredText>
          이 프롬프트에는 이미지를 입력받아요 해요.
        </CheckImageRequiredText>
        <CheckImageRequiredCheckButton
          onClick={() => handleImageRequiredChange(true)}
          $isSelected={imageRequired === true}
        >
          <CheckImageRequiredCheckButtonImage
            $isSelected={imageRequired === true}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="4"
                cy="4"
                r="4"
                fill={imageRequired === true ? "#49D8FF" : "#D9D9D9"}
              />
            </svg>
          </CheckImageRequiredCheckButtonImage>
          <CheckImageRequiredCheckButtonText style={{ marginRight: "1.75rem" }}>
            예
          </CheckImageRequiredCheckButtonText>
        </CheckImageRequiredCheckButton>
        <CheckImageRequiredCheckButton
          onClick={() => handleImageRequiredChange(false)}
          $isSelected={imageRequired === false}
        >
          <CheckImageRequiredCheckButtonImage
            $isSelected={imageRequired === false}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="4"
                cy="4"
                r="4"
                fill={imageRequired === false ? "#49D8FF" : "#D9D9D9"}
              />
            </svg>
          </CheckImageRequiredCheckButtonImage>
          <CheckImageRequiredCheckButtonText>
            아니오
          </CheckImageRequiredCheckButtonText>
        </CheckImageRequiredCheckButton>
      </CheckImageRequiredSection>
    </UploadTemplateWrapper>
  );
}

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
  margin-bottom: 1.19rem;
  min-height: 35vh;
  max-height: 35vh;
  overflow-y: auto;
  border-radius: 1rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
`;

const ContentInput = styled.textarea`
  width: 100%;
  min-height: 35vh;
  border-radius: 1rem;
  padding: 1.94rem 2.44rem;
  border: none;
  resize: none;
  vertical-align: top;
  outline: none;
  font-family: Pretendard;
  font-size: 1.4375rem;
  line-height: 1.5;
  position: relative;
  z-index: 2;
  background: transparent;
  color: transparent;
  caret-color: #454545;
  overflow: hidden;

  &:focus {
    outline: none;
  }

  &::selection {
    background-color: rgba(179, 217, 255, 0.5);
  }

  &::placeholder {
    color: transparent;
  }
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 35vh;
  padding: 1.94rem 2.44rem;
  pointer-events: none;
  z-index: 1;
  font-family: Pretendard;
  font-size: 1.4375rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  color: #454545;
  box-sizing: border-box;
  overflow: hidden;
`;

const HighlightedText = styled.span`
  color: #0066cc;
  background-color: rgba(0, 102, 204, 0.1);
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

const CheckImageRequiredSection = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  margin-left: 1rem;
  align-items: center;
`;

const CheckImageRequiredText = styled.span`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-right: 1.75rem;
  letter-spacing: -0.02rem;
`;

const CheckImageRequiredCheckButton = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  cursor: pointer;
`;

const CheckImageRequiredCheckButtonImage = styled.div`
  width: 0.65rem;
  height: 0.65rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const CheckImageRequiredCheckButtonText = styled.span`
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.05625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.01625rem;
`;
