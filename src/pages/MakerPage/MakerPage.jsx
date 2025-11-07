import React, { useState } from "react";
import styled from "styled-components";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import ResultPanel from "./ResultPanel/ResultPanel";
import apiClient from "../../api/client";

export default function MakerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResultPanelOpen, setIsResultPanelOpen] = useState(true);
  const [upgrades, setUpgrades] = useState([]);

  // AI 업그레이드 요청 처리
  const handleUpgradeRequest = async ({ selectedText, upgradeRequest }) => {
    console.log("업그레이드 요청:", { selectedText, upgradeRequest });

    try {
      const makerId = 1; // TODO: 실제 로그인한 사용자의 makerId로 교체

      const { data } = await apiClient.post(
        `/api/makers/${makerId}/upgrade-text`,
        {
          selectedText: selectedText,
          direction: upgradeRequest,
        }
      );

      console.log("업그레이드 응답 데이터:", data);

      // API 응답을 업그레이드 카드 형식으로 변환
      const newUpgrade = {
        id: Date.now(), // 임시 ID (실제로는 서버에서 받아야 함)
        title: `${data.direction} 업그레이드`,
        content: data.upgradedText,
        originalText: data.originalText,
        direction: data.direction,
        isApplied: false,
      };

      // 기존 업그레이드 목록에 추가
      setUpgrades((prev) => [...prev, newUpgrade]);
    } catch (error) {
      console.error("텍스트 업그레이드 실패:", error);

      // 에러 처리
      let errorMessage = "텍스트 업그레이드에 실패했습니다.";
      if (
        error?.code === "ERR_NAME_NOT_RESOLVED" ||
        error?.message?.includes("ERR_NAME_NOT_RESOLVED")
      ) {
        errorMessage =
          "서버에 연결할 수 없습니다. 서버가 준비되었는지 확인해주세요.";
      } else if (error?.response) {
        errorMessage = `서버 오류: ${error.response.status}`;
      } else if (error?.request) {
        errorMessage = "서버로부터 응답을 받지 못했습니다.";
      }

      alert(errorMessage);
    }
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

  // 업그레이드 아래에 삽입(로직 추가 예정)
  const handleEditUpgrade = (upgradeId) => {
    console.log("아래에 삽입:", upgradeId);
    // TODO: 수정 모달 구현
  };

  return (
    <MakerPageWrapper>
      <SidePanel
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(false)}
        upgrades={upgrades}
        onAcceptUpgrade={handleAcceptUpgrade}
        onCancelUpgrade={handleCancelUpgrade}
        onEditUpgrade={handleEditUpgrade}
      />

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

      <ResultPanel
        isOpen={isResultPanelOpen}
        onToggle={() => setIsResultPanelOpen(false)}
      />
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
