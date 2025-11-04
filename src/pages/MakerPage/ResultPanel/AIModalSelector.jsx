import React, { useState } from "react";
import styled from "styled-components";
import AIDropdownImg from "../../../assets/icon/ai-modal-dropdown.svg";
import GPT5PlusImg from "../../../assets/icon/chatgpt-icon.svg";

function ModalSelector() {
  const [selectedModel, setSelectedModel] = useState("GPT 5 Plus");
  const [isOpen, setIsOpen] = useState(false);

  const models = ["GPT 5 Plus"];

  return (
    <SelectorWrapper>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        <ModelInfo>
          <img src={GPT5PlusImg} />
          <ModelName>{selectedModel}</ModelName>
        </ModelInfo>
        <DropdownIcon src={AIDropdownImg} />
      </SelectorButton>

      {isOpen && (
        <DropdownMenu>
          {models.map((model) => (
            <MenuItem
              key={model}
              onClick={() => {
                setSelectedModel(model);
                setIsOpen(false);
              }}
              $isSelected={model === selectedModel}
            >
              <MenuItemIcon src={GPT5PlusImg} />
              <MenuItemText>{model}</MenuItemText>
              <MenuItemArrow src={AIDropdownImg} />
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </SelectorWrapper>
  );
}

export default ModalSelector;

// styled-components
const SelectorWrapper = styled.div`
  position: relative;
`;

const SelectorButton = styled.button`
  display: flex;
  width: 15.9375rem; /* 255px */
  height: 3.125rem; /* 50px */
  padding: 0.75rem 1.4375rem 0.75rem 2rem; /* 12px 23px 12px 37px */
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6875rem; /* 11px */
  margin-right: auto; /* 왼쪽 정렬 */
`;

const ModelName = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1.4375rem; /* 23px */
  font-weight: 400;
  color: black;
`;

const DropdownIcon = styled.img`
  width: 1.625rem; /* 26px */
  height: 1.625rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 15.9375rem; /* 255px - SelectorButton과 동일 */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.25rem; /* 4px */
  z-index: 1000;
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  width: 100%;
  height: 3.125rem; /* 50px - SelectorButton과 동일 */
  padding: 0.75rem 1.4375rem 0.75rem 2.3125rem; /* 12px 23px 12px 37px */
  align-items: center;
  background: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f8f8f8;
  }
`;

const MenuItemIcon = styled.img`
  width: 1.5rem; /* 24px */
  height: 1.5rem;
  flex-shrink: 0;
`;

const MenuItemText = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1.4375rem; /* 23px */
  font-weight: 400;
  color: black;
  margin-left: 0.6875rem; /* 11px - 아이콘과 텍스트 간격 */
  margin-right: auto; /* 텍스트를 왼쪽으로 */
`;

const MenuItemArrow = styled.img`
  width: 1.625rem; /* 26px */
  height: 1.625rem;
  transform: scaleY(-1); /* 위쪽 화살표 */
  flex-shrink: 0;
  margin-left: 0.9375rem; /* 15px - 텍스트와 화살표 간격 */
`;
