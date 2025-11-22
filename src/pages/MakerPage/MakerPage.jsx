import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
// import apiClient from "../../api/client"; // API 호출 주석처리로 인해 임시 주석처리

export default function MakerPage({ selectedPrompt = null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [upgrades, setUpgrades] = useState([]);
  const [promptContent, setPromptContent] = useState(
    selectedPrompt?.content ?? ""
  );
  const [latestUpgradeId, setLatestUpgradeId] = useState(null);

  useEffect(() => {
    setPromptContent(selectedPrompt?.content ?? "");
    setUpgrades([]);
    setLatestUpgradeId(null);
  }, [selectedPrompt]);

  // 프롬프트 업그레이드 API 연동
  const handleUpgradeRequest = async ({
    selectedText,
    upgradeRequest,
    selectionRange,
    contentSnapshot,
  }) => {
    console.log("업그레이드 요청:", { selectedText, upgradeRequest });

    try {
      // const makerId = selectedPrompt?.makerId ?? 1; // TODO: 실제 로그인한 사용자의 makerId로 교체

      // API 호출 주석처리
      // const { data } = await apiClient.post(
      //   `/api/makers/${makerId}/upgrade-text`,
      //   {
      //     selectedText: selectedText,
      //     direction: upgradeRequest,
      //   }
      // );

      // MOCK 데이터 사용
      const mockData = {
        direction: upgradeRequest,
        upgradedText: `평범한 인물들의 일상적인 사건 속에서 작은 친절이나 선택이 감정을 변화시키는 순간을 중심으로 써줘. 문체는 짧고 자연스럽게 이어지면서, 인물의 감정이 직접 묘사되지 않아도 독자가 느낄 수 있도록 표현해줘.`,
        originalText: selectedText,
      };

      console.log("업그레이드 응답 데이터 (MOCK):", mockData);

      // API 응답을 업그레이드 카드 형식으로 변환
      const newUpgrade = {
        id: Date.now(), // 임시 ID (실제로는 서버에서 받아야 함)
        content: mockData.upgradedText,
        originalText: mockData.originalText,
        direction: mockData.direction,
        isApplied: false,
        selectionRange,
        contentSnapshot,
      };

      // 기존 업그레이드 목록에 추가
      setUpgrades((prev) => [...prev, newUpgrade]);
      setLatestUpgradeId(newUpgrade.id);
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
    setUpgrades((prev) => {
      const target = prev.find((upgrade) => upgrade.id === upgradeId);
      if (!target) {
        return prev;
      }

      if (target.selectionRange) {
        const { start, end } = target.selectionRange;
        if (typeof start === "number" && typeof end === "number") {
          setPromptContent((currentContent) => {
            const before = currentContent.slice(0, start);
            const after = currentContent.slice(end);
            return `${before}${target.content}${after}`;
          });
        }
      }

      // 즉시 제거
      return prev.filter((upgrade) => upgrade.id !== upgradeId);
    });

    // 완료되어 오버레이 효과 제거
    if (latestUpgradeId === upgradeId) {
      setLatestUpgradeId(null);
    }
  };

  // 업그레이드 취소
  const handleCancelUpgrade = (upgradeId) => {
    setUpgrades((prev) => prev.filter((upgrade) => upgrade.id !== upgradeId));

    if (latestUpgradeId === upgradeId) {
      setLatestUpgradeId(null);
    }
  };

  // 업그레이드 아래에 삽입
  const handleEditUpgrade = (upgradeId) => {
    const target = upgrades.find((upgrade) => upgrade.id === upgradeId);
    if (!target) return;

    if (target.selectionRange) {
      const { end } = target.selectionRange;
      if (typeof end === "number") {
        setPromptContent((currentContent) => {
          const before = currentContent.slice(0, end);
          const after = currentContent.slice(end);
          // 선택된 텍스트 다음에 줄바꿈과 함께 업그레이드된 텍스트 삽입
          return `${before}\n${target.content}${after}`;
        });
      }
    }

    // 업그레이드 제거
    setUpgrades((prev) => prev.filter((upgrade) => upgrade.id !== upgradeId));

    if (latestUpgradeId === upgradeId) {
      setLatestUpgradeId(null);
    }
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
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        promptContent={promptContent}
        onPromptContentChange={setPromptContent}
        onUpgradeRequest={handleUpgradeRequest}
        onAcceptUpgrade={handleAcceptUpgrade}
        onCancelUpgrade={handleCancelUpgrade}
        onEditUpgrade={handleEditUpgrade}
        activeUpgradeId={latestUpgradeId}
        activeUpgrade={upgrades.find((u) => u.id === latestUpgradeId)}
        onRunPrompt={() => {
          // TODO: 프롬프트 실행 로직
          console.log("프롬프트 실행:", promptContent);
        }}
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
