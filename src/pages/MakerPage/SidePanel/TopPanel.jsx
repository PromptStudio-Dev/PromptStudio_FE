import React from "react";
import styled from "styled-components";
import SearchInput from "../components/SearchInput";
import HubModalSelector from "../components/HubModalSelector";
import SidePanelClose from "../../../assets/icon/tabler_chevrons-open.svg";

function TopPanel({ onClose }) {
  return (
    <TopContainer>
      <SearchInput />
      <HubModalSelector />
      {onClose && (
        <CloseButton onClick={onClose} aria-label="사이드바 닫기">
          <CloseIcon src={SidePanelClose} />
        </CloseButton>
      )}
    </TopContainer>
  );
}

export default TopPanel;

// styled-components

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  padding: 2.7vh 1.93vw;
  width: 100%;
  background-color: #001e40;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const CloseIcon = styled.img`
  width: 10vh;
  height: auto;
`;
