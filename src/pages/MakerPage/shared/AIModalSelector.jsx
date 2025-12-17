import React, { useState } from "react";
import styled from "styled-components";
import AIDropdownImg from "../assets/ai-modal-dropdown.svg";
import GPT5PlusImg from "../assets/chatgpt-icon.svg";

export default function AIModalSelector() {
  const [selectedModel, setSelectedModel] = useState("GPT 5 Plus");
  const [isOpen, setIsOpen] = useState(false);

  const models = ["GPT 5 Plus"];

  return (
    <SelectorWrapper>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        <ModelInfo>
          <ModelImg src={GPT5PlusImg} />
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
              <MenuItemInfo>
                <MenuItemIcon src={GPT5PlusImg} />
                <MenuItemText>{model}</MenuItemText>
              </MenuItemInfo>
              <MenuItemArrow src={AIDropdownImg} />
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </SelectorWrapper>
  );
}

// styled-components
const SelectorWrapper = styled.div`
  position: relative;
  width: 11rem;
  height: auto;
`;

const ModelImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const SelectorButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 1.625rem;
  padding: 0.75rem 0.5rem;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    opacity: 0.8;
  }
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.38rem;
  flex: 1;
  min-width: 0;
`;

const ModelName = styled.span`
  font-size: 1.1875rem;
  font-weight: 500;
  color: black;
  line-height: 100%;
  letter-spacing: 0%;
`;

const DropdownIcon = styled.img`
  width: 1.625rem; /* 26px */
  height: 1.625rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  min-height: 1.625rem;
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
  min-height: 1.625rem;
  padding: 0.75rem 0.5rem;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: #f8f8f8;
  }
`;

const MenuItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.38rem;
  flex: 1;
  min-width: 0;
`;

const MenuItemIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const MenuItemText = styled.span`
  font-size: 1.1875rem;
  font-weight: 500;
  color: black;
  line-height: 100%;
  letter-spacing: 0%;
`;

const MenuItemArrow = styled.img`
  width: 1.625rem;
  height: 1.625rem;
  transform: scaleY(-1);
  flex-shrink: 0;
`;
