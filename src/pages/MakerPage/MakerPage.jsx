import React, { useState } from "react";
import styled from "styled-components";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import ResultPanel from "./ResultPanel/ResultPanel";

function MakerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResultPanelOpen, setIsResultPanelOpen] = useState(true);

  return (
    <MakerPageWrapper>
      {isSidebarOpen && <SidePanel onToggle={() => setIsSidebarOpen(false)} />}

      <MainPanel
        isSidebarOpen={isSidebarOpen}
        isResultPanelOpen={isResultPanelOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleResultPanel={() => setIsResultPanelOpen(!isResultPanelOpen)}
      />

      {isResultPanelOpen && (
        <ResultPanel onToggle={() => setIsResultPanelOpen(false)} />
      )}
    </MakerPageWrapper>
  );
}

export default MakerPage;

const MakerPageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fdffff;
  position: relative;
  overflow-x: hidden;
`;
