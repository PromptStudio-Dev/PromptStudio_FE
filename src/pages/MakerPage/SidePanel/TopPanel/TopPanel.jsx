import React from "react";
import styled from "styled-components";
import SearchInput from "./SearchInput";
import HubModalSelector from "./HubModalSelector";
import SidePanelCloseImg from "../../assets/side-panel-close.svg";

export default function TopPanel({
  onClose,
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
}) {
  return (
    <TopContainer>
      <SearchRow>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearchSubmit}
        />
        {onClose && (
          <CloseButton onClick={onClose} aria-label="사이드바 닫기">
            <CloseIcon src={SidePanelCloseImg} />
          </CloseButton>
        )}
      </SearchRow>
      <HubModalSelector />
    </TopContainer>
  );
}

// styled-components
const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  padding: 2.7vh 1.93vw;
  width: 100%;
  background-color: #f6fcff;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const CloseIcon = styled.img`
  width: auto;
  height: 1.5rem;
`;
