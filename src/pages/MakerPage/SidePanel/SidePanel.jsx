import React from "react";
import TopPanel from "./TopPanel/TopPanel.jsx";
import styled from "styled-components";
import PromptHublist from "./PromptHublist";
import UpgradeSection from "./UpgradeSection";

// props는 나중에 백엔드 연동 시 처리를 위해 선언
function SidePanel({
  onToggle,
  upgrades,
  onAcceptUpgrade,
  onCancelUpgrade,
  onEditUpgrade,
}) {
  return (
    <SidebarWrapper>
      <TopPanel onClose={onToggle} />
      <ContentWrapper>
        <UpgradeSection
          upgrades={upgrades}
          onAccept={onAcceptUpgrade}
          onCancel={onCancelUpgrade}
          onEdit={onEditUpgrade}
        />
        <PromptHublist />
      </ContentWrapper>
    </SidebarWrapper>
  );
}

export default SidePanel;

const SidebarWrapper = styled.div`
  width: 23.8vw; /* 457px / 1920px */
  height: 100%;
  background-color: #001e40;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 5px 0px 26px 0px rgba(0, 0, 0, 0.06);
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
