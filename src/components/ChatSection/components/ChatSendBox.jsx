import React, { forwardRef, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import AttachmentIcon from "../assets/imageAttachIcon.svg";
import sendPossibleIcon from "../assets/sendPossibleIcon.svg";
import sendImpossibleIcon from "../assets/sendImpossibleIcon.svg";
import DownIcon from "../assets/downIcon.svg";

const ChatSendBox = forwardRef(
  (
    {
      textareaRef,
      value,
      handleTextareaChange,
      fileInputRef,
      handleImageAttachClick,
      handleDragOver,
      handleDrop,
      onSendMessage,
      onKeyDown,
      hasContent = false,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("GPT 5.1");
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const options = ["GPT 5.1", "GPT 5", "Gemini 3.0", "Sonnet 4.5"];

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)
        ) {
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isDropdownOpen]);

    const handleOptionSelect = (option) => {
      setSelectedOption(option);
      setIsDropdownOpen(false);
    };

    return (
      <ChatSendBoxContainer
        ref={ref}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <ChatSendBoxInput
          ref={textareaRef}
          value={value}
          placeholder="오늘 어떤 도움을 드릴까요"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onChange={handleTextareaChange}
          onInput={handleTextareaChange}
          onKeyDown={onKeyDown}
          disabled={isLoading}
        />
        <ChatSendBoxBottomSection>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={props.handleImageSelect}
          />
          <ChatSendBoxImageAttachButton
            src={AttachmentIcon}
            alt="이미지 첨부"
            onClick={handleImageAttachClick}
            style={{ cursor: "pointer" }}
          />
          <ChatSendBoxRightGroup>
            <ChatSendOptionButtonWrapper>
              <ChatSendOptionButton
                ref={buttonRef}
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <ChatSendOptionLabel>{selectedOption}</ChatSendOptionLabel>
                <ChatSendOptionIcon
                  src={DownIcon}
                  alt="옵션 선택"
                  $isOpen={isDropdownOpen}
                />
              </ChatSendOptionButton>
              {isDropdownOpen && (
                <ChatSendOptionDropdown ref={dropdownRef}>
                  {options.map((option) => (
                    <ChatSendOptionItem
                      key={option}
                      $isSelected={selectedOption === option}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </ChatSendOptionItem>
                  ))}
                </ChatSendOptionDropdown>
              )}
            </ChatSendOptionButtonWrapper>
            <ChatSendBoxSendMessageButton
              src={
                hasContent && !isLoading ? sendPossibleIcon : sendImpossibleIcon
              }
              alt="메시지 전송"
              onClick={onSendMessage}
              style={{
                cursor: hasContent && !isLoading ? "pointer" : "not-allowed",
              }}
            />
          </ChatSendBoxRightGroup>
        </ChatSendBoxBottomSection>
      </ChatSendBoxContainer>
    );
  }
);

ChatSendBox.displayName = "ChatSendBox";

export default ChatSendBox;

// 스타일 컴포넌트들
const ChatSendBoxContainer = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.3rem 1rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: -1px -1px 16px 0 #ddf4ff, 1px 1px 8px 0 rgba(0, 0, 0, 0.16);
`;

const ChatSendBoxInput = styled.textarea`
  width: 100%;
  min-height: 4rem;
  max-height: 11rem;
  border: none;
  border-radius: 0.75rem;
  background: transparent;
  color: #001e40;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: height 0.2s ease;
  overflow-y: auto;
  box-sizing: border-box;

  &::placeholder {
    color: #9bb4c9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 1600px) {
    min-height: 3rem;
  }
`;

const ChatSendBoxBottomSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ChatSendBoxRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ChatSendBoxImageAttachButton = styled.img`
  width: 1.9375rem;
  height: 1.9375rem;
`;

const ChatSendOptionButtonWrapper = styled.div`
  position: relative;
`;

const ChatSendOptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const ChatSendOptionLabel = styled.span`
  font-family: "Pretendard";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #000;
`;

const ChatSendOptionIcon = styled.img`
  width: 1rem;
  height: 1rem;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease;
`;

const ChatSendOptionDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
`;

const ChatSendOptionItem = styled.div`
  padding: 0.75rem 1rem;
  font-family: "Pretendard";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: ${({ $isSelected }) => ($isSelected ? "600" : "400")};
  line-height: normal;
  color: ${({ $isSelected }) => ($isSelected ? "#00aeff" : "#000")};
  background: ${({ $isSelected }) => ($isSelected ? "#f5fcff" : "transparent")};
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? "#f5fcff" : "#f9f9f9")};
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const ChatSendBoxSendMessageButton = styled.img`
  width: 2.25rem;
  height: 2.25rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
