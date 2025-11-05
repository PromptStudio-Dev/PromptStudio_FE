import React, { useState } from "react";
import styled from "styled-components";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import ResultPanel from "./ResultPanel/ResultPanel";

export default function MakerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResultPanelOpen, setIsResultPanelOpen] = useState(true);
  const [upgrades, setUpgrades] = useState([]);

  // AI 업그레이드 요청 처리 (백엔드 API 연동 예정)
  const handleUpgradeRequest = async (upgradeRequest) => {
    console.log("업그레이드 요청:", upgradeRequest);

    // TODO: 백엔드 API 호출

    // 임시 목업 데이터 (백엔드 응답 대신)
    const mockUpgrades = [
      {
        id: 1,
        title: "추천 1 (유럽 고대 문화형, 적용됨)",
        content:
          "따라 하는 얼굴의 아주 고급진 표현방식을 따라해. 첨부한 이미지 속 인물의 엘레강스하고 드라마틱한 유럽문화의 고대그리수도가 떠오르는 모딕한 헤어스타일과...",
        isApplied: true,
      },
      {
        id: 2,
        title: "추천 2 (귀여운 이미지형)",
        content:
          "따라 하는 얼굴의 아주 고급진 표현방식을 따라해. 귀여운 이미지 속 인물의 깜찍하고 귀여운 그런느낌알잖아 뭔지 아는 헤어스타일과...",
        isApplied: false,
      },
      {
        id: 3,
        title: "추천 3 (시크한 이미지형)",
        content:
          "따라 하는 얼굴의 아주 고급진 표현방식을 따라해. 섹시한 고고한 이미지 속 인물의 시크한 매력 찰랑거리며 윤기나는 뭔지 아는 헤어스타일과...",
        isApplied: false,
      },
    ];

    setUpgrades(mockUpgrades);
  };

  // 업그레이드 수락
  const handleAcceptUpgrade = (upgradeId) => {
    console.log("수락:", upgradeId);
    setUpgrades((prev) =>
      prev.map((upgrade) =>
        upgrade.id === upgradeId
          ? { ...upgrade, isApplied: true }
          : { ...upgrade, isApplied: false }
      )
    );
  };

  // 업그레이드 취소
  const handleCancelUpgrade = (upgradeId) => {
    console.log("취소:", upgradeId);
    setUpgrades((prev) => prev.filter((upgrade) => upgrade.id !== upgradeId));
  };

  // 업그레이드 수정
  const handleEditUpgrade = (upgradeId) => {
    console.log("수정:", upgradeId);
    // TODO: 수정 모달 구현
  };

  return (
    <MakerPageWrapper>
      {isSidebarOpen && (
        <SidePanel
          onToggle={() => setIsSidebarOpen(false)}
          upgrades={upgrades}
          onAcceptUpgrade={handleAcceptUpgrade}
          onCancelUpgrade={handleCancelUpgrade}
          onEditUpgrade={handleEditUpgrade}
        />
      )}

      <MainPanel
        isSidebarOpen={isSidebarOpen}
        isResultPanelOpen={isResultPanelOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleResultPanel={() => setIsResultPanelOpen(!isResultPanelOpen)}
        onUpgradeRequest={handleUpgradeRequest}
        onAcceptUpgrade={handleAcceptUpgrade}
        onCancelUpgrade={handleCancelUpgrade}
        onEditUpgrade={handleEditUpgrade}
      />

      {isResultPanelOpen && (
        <ResultPanel onToggle={() => setIsResultPanelOpen(false)} />
      )}
    </MakerPageWrapper>
  );
}

const MakerPageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fdffff;
  position: relative;
  overflow-x: hidden;
`;
