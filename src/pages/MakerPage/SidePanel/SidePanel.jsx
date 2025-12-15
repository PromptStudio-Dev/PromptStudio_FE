import React, { useState, useEffect } from "react";
import TopPanel from "./TopPanel/TopPanel.jsx";
import styled from "styled-components";
import PromptHub from "./PromptHub/PromptHub";
import UpgradeSection from "./UpgradeSection";

// props는 나중에 백엔드 연동 시 처리를 위해 선언
export default function SidePanel({
  isOpen = true,
  onToggle,
  upgrades,
  onAcceptUpgrade,
  onCancelUpgrade,
  onEditUpgrade,
  onReupgrade,
}) {
  const hasUpgrades = Array.isArray(upgrades) && upgrades.length > 0;
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedHub, setSelectedHub] = useState("모든 허브");

  useEffect(() => {
    if (searchInput.trim() === "") {
      setSearchKeyword("");
    }
  }, [searchInput]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    setSearchKeyword(trimmed);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
  };

  return (
    <SidebarWrapper $isOpen={isOpen}>
      <TopPanel
        onClose={onToggle}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        selectedHub={selectedHub}
        onHubChange={setSelectedHub}
        disabled={hasUpgrades}
      />
      <ContentWrapper>
        {hasUpgrades ? (
          <UpgradeOnlyContainer>
            <UpgradeSection
              upgrades={upgrades}
              onAccept={onAcceptUpgrade}
              onCancel={onCancelUpgrade}
              onEdit={onEditUpgrade}
              onReupgrade={onReupgrade}
            />
          </UpgradeOnlyContainer>
        ) : (
          <PromptHubContainer>
            <PromptHub
              searchKeyword={searchKeyword}
              onClearSearch={handleClearSearch}
              selectedHub={selectedHub}
            />
          </PromptHubContainer>
        )}
      </ContentWrapper>
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.div`
  width: 28.5625rem;
  height: 100%;
  background-color: #001e40;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  position: relative;
  box-shadow: 5px 0px 26px 0px rgba(0, 0, 0, 0.06);
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
`;

const UpgradeOnlyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const PromptHubContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
