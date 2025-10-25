import React, { useState } from "react";
import styled from "styled-components";
import DropdownImage from "../../../assets/icon/tabler_caret-down-filled.svg";

function HubModalSelector() {
  const [selectedModel, setSelectedModel] = useState("모든 허브");
  const [isOpen, setIsOpen] = useState(false);

  const models = ["모든 허브", "아카이브", "하트"];

  return (
    <SelectorWrapper>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        <ModelInfo>
          <ModelName>{selectedModel}</ModelName>
        </ModelInfo>
        <DropdownIcon src={DropdownImage} />
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
              {model}
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </SelectorWrapper>
  );
}

export default HubModalSelector;

const SelectorWrapper = styled.div`
  position: relative;
`;

const SelectorButton = styled.button`
  width: 8.7vw;
  height: 4.8vh;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 양쪽 끝 정렬 */
  padding: 0.69rem 0.94rem 0.69rem 1.5rem;
  background-color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const ModelName = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
`;

const DropdownIcon = styled.img`
  width: 1.625rem;
  height: auto;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  min-width: 150px;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(props) => (props.$isSelected ? "#f4f4f4" : "white")};
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.19rem;
  color: ${(props) => (props.$isSelected ? "#001e40" : "#454545")};

  &:hover {
    background: #f4f4f4;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;
