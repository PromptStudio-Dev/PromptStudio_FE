import React from "react";
import styled from "styled-components";
import PromptTitleInput from "../components/PromptTitleInput";
import PromptEditor from "../components/PromptEditor";
import ImageUploader from "../components/ImageUploader";
import ResultPanelOpen from "../../../assets/icon/tabler_chevrons-open.svg";
import SidePanelOpen from "../../../assets/icon/tabler_chevrons-close.svg";

function MainPanel({
  isSidebarOpen,
  isResultPanelOpen,
  onToggleSidebar,
  onToggleResultPanel,
}) {
  return (
    <MakerPanelWrapper
      $isSidebarOpen={isSidebarOpen}
      $isResultPanelOpen={isResultPanelOpen}
    >
      {/* 사이드바 토글 버튼 */}
      {!isSidebarOpen && (
        <SidebarOpenButton onClick={onToggleSidebar} aria-label="사이드바 열기">
          <ToggleIcon src={SidePanelOpen} />
        </SidebarOpenButton>
      )}

      {/* 메인 컨텐츠 영역 */}
      <ContentArea>
        <PromptTitleInput />
        <PromptEditor />
        <ImageUploader />
      </ContentArea>

      {/* ResultPanel 토글 버튼 */}
      {!isResultPanelOpen && (
        <ResultOpenButton
          onClick={onToggleResultPanel}
          aria-label="결과 패널 열기"
        >
          <ToggleIcon src={ResultPanelOpen} />
        </ResultOpenButton>
      )}
    </MakerPanelWrapper>
  );
}

export default MainPanel;

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
  background-color: #001e40;
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
  /* rem을 vw/vh로 자동 변환 (2.625rem → 2.19vw, 10.0625rem → 14.91vh) */
  width: 2.19vw; /* 42px */
  height: 14.91vh; /* 161px */
  background-color: #001e40;
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
  width: 1.5rem;
  height: 1.5rem;
`;

const ContentArea = styled.div`
  padding: 3vh 5vw;
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;
