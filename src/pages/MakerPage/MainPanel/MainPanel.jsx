import React from "react";
import styled from "styled-components";
import PromptTitleInput from "./PromptTitleInput";
import PromptEditor from "./PromptEditor";
import ImageUploader from "./ImageUploader";
import ControlBar from "./ResultSection/ControlBar";
import SidePanelOpenImg from "../assets/panel-close-open.svg";

export default function MainPanel({
  isSidebarOpen,
  onToggleSidebar,
  promptContent,
  onPromptContentChange,
  onUpgradeRequest,
  onAcceptUpgrade,
  onCancelUpgrade,
  onEditUpgrade,
  activeUpgradeId,
  activeUpgrade,
  onRunPrompt,
  onOpenResultPanel,
  isResultPanelOpen = false,
}) {
  return (
    <MakerPanelWrapper
      $isSidebarOpen={isSidebarOpen}
      $isResultPanelOpen={isResultPanelOpen}
      data-main-panel
    >
      {/* 사이드바 토글 버튼 */}
      {!isSidebarOpen && (
        <SidebarOpenButton onClick={onToggleSidebar} aria-label="사이드바 열기">
          <ToggleIcon src={SidePanelOpenImg} />
        </SidebarOpenButton>
      )}

      {/* 메인 컨텐츠 영역 */}
      <ContentArea>
        <TopSection>
          <TitleAndControlRow>
            <PromptTitleInput />
            {/* ResultPanel이 열려있을 때 ControlBar 숨기기 */}
            {!isResultPanelOpen && (
              <ControlBar
                onRun={onRunPrompt}
                onOpenResultPanel={onOpenResultPanel}
              />
            )}
          </TitleAndControlRow>
          <PromptInputWrapper $isResultPanelOpen={isResultPanelOpen}>
            <MakerTipButton>
              <MakerTipText>Tip</MakerTipText>
            </MakerTipButton>
            <PromptEditor
              content={promptContent}
              onContentChange={onPromptContentChange}
              onUpgradeRequest={onUpgradeRequest}
              onAcceptUpgrade={onAcceptUpgrade}
              onCancelUpgrade={onCancelUpgrade}
              onEditUpgrade={onEditUpgrade}
              activeUpgradeId={activeUpgradeId}
              activeUpgrade={activeUpgrade}
              isResultPanelOpen={isResultPanelOpen}
            />
          </PromptInputWrapper>
        </TopSection>
        <ImageUploader />
      </ContentArea>
    </MakerPanelWrapper>
  );
}

const MakerTipButton = styled.button`
  background-color: #f2f2f2;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 0.34rem 0.63rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
`;

const MakerTipText = styled.p`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  color: #000000;
  font-weight: 600;
`;

const MakerPanelWrapper = styled.div`
  flex: 1;
  background-color: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  /* 사이드바 상태에 따른 왼쪽 여백 */
  padding-left: ${(props) => (props.$isSidebarOpen ? "0" : "3vw")};

  /* ResultPanel이 열려있을 때 오른쪽 여백 추가 (ResultPanel 너비만큼) */
  margin-right: ${(props) => (props.$isResultPanelOpen ? "36.0625rem" : "0")};
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

const ToggleIcon = styled.img`
  width: auto;
  height: 2.5vh;
`;

const ContentArea = styled.div`
  padding: 1.75rem 2.81rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  flex: 1;
  min-height: 0;
`;

const TitleAndControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
`;

const PromptInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* ResultPanel이 열려있을 때는 적용 x */
  max-width: ${(props) =>
    props.$isResultPanelOpen ? "none" : "calc(100% - 20rem)"};
  flex: 1;
  min-height: 0;
`;
