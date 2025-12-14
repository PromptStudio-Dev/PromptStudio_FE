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
  promptTitle,
  onPromptTitleChange,
  attachedImages,
  onAttachedImagesChange,
  onUpgradeRequest,
  onAcceptUpgrade,
  onCancelUpgrade,
  onEditUpgrade,
  activeUpgradeId,
  activeUpgrade,
  historyItems = [],
  onRunPrompt,
  onOpenResultPanel,
  isResultPanelOpen = false,
  isResultPanelExpanded = false,
  isResultModalOpen = false,
  isResultLoading = false,
}) {
  return (
    <MakerPanelWrapper
      $isSidebarOpen={isSidebarOpen}
      $isResultPanelOpen={isResultPanelOpen}
      $isResultPanelExpanded={isResultPanelExpanded}
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
            <PromptTitleInput
              value={promptTitle}
              onChange={onPromptTitleChange}
            />
            {/* ResultPanel이 열려있거나 확장되었을 때 ControlBar 숨기기 */}
            {!isResultPanelOpen && !isResultPanelExpanded && (
              <ControlBar
                onRun={onRunPrompt}
                onOpenResultPanel={onOpenResultPanel}
                hasHistory={historyItems.length > 0}
                isResultModalOpen={isResultModalOpen}
                isResultLoading={isResultLoading}
              />
            )}
          </TitleAndControlRow>
          <PromptInputWrapper $isResultPanelOpen={isResultPanelOpen}>
            <TipWrapper>
              <MakerTipButton>
                <MakerTipText>Tip</MakerTipText>
              </MakerTipButton>
              <TipTooltip>
                40자 이상 드래그하면 쉽고 간편한 AI 업그레이드 기능을 사용할 수
                있습니다!
              </TipTooltip>
            </TipWrapper>
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
        <ImageUploader
          attachedImages={attachedImages}
          onAttachedImagesChange={onAttachedImagesChange}
        />
      </ContentArea>
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

  /* ResultPanel이 확장되었을 때는 MainPanel 숨기기 */
  display: ${(props) => (props.$isResultPanelExpanded ? "none" : "flex")};

  /* ResultPanel이 열려있을 때 오른쪽 여백 추가 (ResultPanel 너비만큼) */
  margin-right: ${(props) => (props.$isResultPanelOpen ? "36.0625rem" : "0")};
`;

const TipTooltip = styled.div`
  position: absolute;
  top: 50%;
  left: calc(100% + 0.69rem);
  transform: translateY(-50%) translateX(-0.25rem);
  background: #f2f2f2;
  color: #000000;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 100%;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
  z-index: 5;
`;

const TipWrapper = styled.div`
  position: relative;
  width: fit-content;

  &:hover ${TipTooltip} {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(0);
  }
`;

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
