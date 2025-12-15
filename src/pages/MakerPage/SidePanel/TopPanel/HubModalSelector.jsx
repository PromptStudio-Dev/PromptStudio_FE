import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import HubDropdownImg from "../../assets/hub-modal-dropdown.svg";
import HubBackButtonImg from "../../assets/hub-modal-backbutton.svg";

export default function HubModalSelector({
  selectedModel,
  onModelChange,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const models = ["모든 허브", "내가 작성한 글", "좋아요"];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen && !disabled) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    } else if (isOpen && disabled) {
      setIsOpen(false);
    }
  }, [isOpen, disabled]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleBackClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onModelChange?.("모든 허브");
  };

  const showBackButton =
    selectedModel === "내가 작성한 글" || selectedModel === "좋아요";

  return (
    <SelectorWrapper ref={wrapperRef}>
      <SelectorButton
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        $disabled={disabled}
      >
        <ModelInfo>
          {showBackButton && (
            <BackButtonWrapper>
              <BackButton onClick={handleBackClick} type="button">
                <BackButtonIcon src={HubBackButtonImg} alt="뒤로" />
              </BackButton>
              <Divider />
            </BackButtonWrapper>
          )}
          <ModelName>{selectedModel}</ModelName>
        </ModelInfo>
        <DropdownIcon src={HubDropdownImg} />
      </SelectorButton>

      {isOpen && !disabled && (
        <DropdownMenu role="listbox">
          {models.map((model) => (
            <MenuItem
              key={model}
              onClick={() => {
                onModelChange?.(model);
                setIsOpen(false);
              }}
              $isSelected={model === selectedModel}
              role="option"
              aria-selected={model === selectedModel}
              tabIndex={0}
            >
              {model}
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </SelectorWrapper>
  );
}

const SelectorWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const SelectorButton = styled.button`
  width: 21.875rem;
  height: 3.0625rem;
  background-color: ${(props) => (props.$disabled ? "#f5f5f5" : "#ffffff")};
  border: 0.0625rem solid
    ${(props) => (props.$disabled ? "#e0e0e0" : "#aadff7")};
  border-radius: 120px;
  padding: 0 1rem 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const BackButtonIcon = styled.img`
  width: 1.625rem;
  height: 1.625rem;
`;

const BackButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Divider = styled.div`
  width: 0.0625rem;
  height: 1.1875rem;
  background-color: #d9d9d9;
  flex-shrink: 0;
`;

const ModelName = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
  line-height: 100%;
  font-weight: 500;
  color: #454545;
`;

const DropdownIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 0.1rem solid #aadff7;
  width: 21.875rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
  color: ${(props) => (props.$isSelected ? "#001e40" : "#454545")};

  &:hover {
    background: #e0f5ff;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;
