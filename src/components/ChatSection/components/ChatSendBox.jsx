import React, { forwardRef } from "react";
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
            <ChatSendOptionButton type="button">
              <ChatSendOptionLabel>GPT 5 Plus</ChatSendOptionLabel>
              <ChatSendOptionIcon src={DownIcon} alt="옵션 선택" />
            </ChatSendOptionButton>
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
`;

const ChatSendBoxSendMessageButton = styled.img`
  width: 2.25rem;
  height: 2.25rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
