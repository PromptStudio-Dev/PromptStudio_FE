import React, { useState } from "react";
import styled from "styled-components";
import HubDropdownImg from "../../../assets/icon/hub-modal-dropdown.svg";

function HubModalSelector() {
  const [selectedModel, setSelectedModel] = useState("모든 허브");
  const [isOpen, setIsOpen] = useState(false);

  const models = ["모든 허브", "아카이브", "좋아요"];

  return (
    <SelectorWrapper>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        <ModelInfo>
          <ModelName>{selectedModel}</ModelName>
        </ModelInfo>
        <DropdownIcon src={HubDropdownImg} />
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
  display: flex;
  justify-content: space-between;
`;

const SelectorButton = styled.button`
  width: 18.23vw;
  height: 4.54vh;
  background-color: #ffffff;
  border: 1px solid #aadff7;
  border-radius: 120px;
  padding: 0 1vw 0 1.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f6fcff;
  }
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ModelName = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.99vw;
  font-weight: 500;
  color: #454545;
`;

const DropdownIcon = styled.img`
  width: 1.35vw;
  height: 2.41vh;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #aadff7;
  width: 18.23vw;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
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
