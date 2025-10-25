import React from "react";
import TopPanel from "./TopPanel";
import styled from "styled-components";
import PromptHublist from "./PromptHublist";

function SidePanel({ onToggle }) {
  return (
    <SidebarWrapper>
      <TopPanel onClose={onToggle} />
      <PromptHublist />
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
