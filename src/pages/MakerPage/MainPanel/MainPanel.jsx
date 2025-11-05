import React from "react";
import styled from "styled-components";
import PromptTitleInput from "./PromptTitleInput";
import PromptEditor from "./PromptEditor";
import ImageUploader from "./ImageUploader";
import ResultPanelOpenImg from "../assets/tabler_chevrons-open.svg";
import SidePanelOpenImg from "../assets/panel-close-open.svg";

export default function MainPanel({
  isSidebarOpen,
  isResultPanelOpen,
  onToggleSidebar,
  onToggleResultPanel,
  onUpgradeRequest,
  onAcceptUpgrade,
  onCancelUpgrade,
  onEditUpgrade,
}) {
  return (
    <MakerPanelWrapper
      $isSidebarOpen={isSidebarOpen}
      $isResultPanelOpen={isResultPanelOpen}
    >
      {/* 사이드바 토글 버튼 */}
      {!isSidebarOpen && (
        <SidebarOpenButton onClick={onToggleSidebar} aria-label="사이드바 열기">
          <ToggleIcon src={SidePanelOpenImg} />
        </SidebarOpenButton>
      )}

      {/* 메인 컨텐츠 영역 */}
      <ContentArea>
        <PromptInputWrapper>
          <PromptTitleInput />
          <PromptEditor
            onUpgradeRequest={onUpgradeRequest}
            onAcceptUpgrade={onAcceptUpgrade}
            onCancelUpgrade={onCancelUpgrade}
            onEditUpgrade={onEditUpgrade}
          />
        </PromptInputWrapper>
        <ImageUploader />
      </ContentArea>

      {/* ResultPanel 토글 버튼 */}
      {!isResultPanelOpen && (
        <ResultOpenButton
          onClick={onToggleResultPanel}
          aria-label="결과 패널 열기"
        >
          <ToggleIcon src={ResultPanelOpenImg} />
        </ResultOpenButton>
      )}
    </MakerPanelWrapper>
  );
}

const MakerPanelWrapper = styled.div`
  flex: 1;
  background-color: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  /* 사이드바 상태에 따른 왼쪽 여백 */
  padding-left: ${(props) => (props.$isSidebarOpen ? "0" : "3vw")};

  /* ResultPanel 상태에 따른 오른쪽 여백 */
  padding-right: ${(props) => (props.$isResultPanelOpen ? "0" : "3vw")};
`;

const SidebarOpenButton = styled.button`
  position: fixed;
  left: 0;
  top: 30%;
  transform: translateY(-50%);
  width: 3vh;
  height: 10vh; /* 100px */
  background-color: #aadff7;
  border: none;
  border-radius: 0 2.25rem 2.25rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 100;

  &:hover {
    opacity: 0.9;
  }
`;

const ResultOpenButton = styled.button`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2.19vw;
  height: 14.91vh;
  background-color: #aadff7;
  border: none;
  border-radius: 2.25rem 0 0 2.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  gap: 0.5rem;
  z-index: 100;

  &:hover {
    opacity: 0.9;
  }
`;

const ToggleIcon = styled.img`
  width: auto;
  height: 2.5vh;
`;

const ContentArea = styled.div`
  padding: 3vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-height: 0;
`;

const PromptInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
