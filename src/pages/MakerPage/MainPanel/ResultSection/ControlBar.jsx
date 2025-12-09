import React from "react";
import styled from "styled-components";
import AIModalSelector from "../AIModalSelector";
import ResultPanelOpenEnabledImg from "../../assets/prompt-run-open-enabled.svg";
import ResultPanelOpenDisabledImg from "../../assets/prompt-run-open-disabled.svg";

export default function ControlBar({
  onRun,
  onOpenResultPanel,
  hasHistory = false,
  isResultModalOpen = false,
}) {
  // History가 있고 ResultModal이 열려있지 않을 때만 버튼 활성화
  const isButtonEnabled = hasHistory && !isResultModalOpen;

  const handleOpenResultPanel = () => {
    // 버튼이 활성화되어 있을 때만 ResultPanel 열기
    if (isButtonEnabled && onOpenResultPanel) {
      onOpenResultPanel();
    }
  };

  return (
    <ControlBarWrapper>
      <AIModalSelector />
      <SecondWrapper>
        <RunButton onClick={onRun}>
          <ButtonText>PROMPT</ButtonText>
          <ButtonText>RUN</ButtonText>
        </RunButton>
        <OpenResultPanelButton
          src={
            isButtonEnabled
              ? ResultPanelOpenEnabledImg
              : ResultPanelOpenDisabledImg
          }
          onClick={handleOpenResultPanel}
          alt="결과 패널 열기"
          $isEnabled={isButtonEnabled}
        />
      </SecondWrapper>
    </ControlBarWrapper>
  );
}

const SecondWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const OpenResultPanelButton = styled.img`
  width: 2.25rem;
  height: auto;
  cursor: ${(props) => (props.$isEnabled ? "pointer" : "not-allowed")};
  opacity: ${(props) => (props.$isEnabled ? 1 : 0.5)};

  &:hover {
    opacity: ${(props) => (props.$isEnabled ? 0.8 : 0.5)};
  }

  &:active {
    transform: ${(props) => (props.$isEnabled ? "scale(0.95)" : "none")};
  }
`;

const ControlBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
  gap: 1.25rem;
`;

const RunButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.5rem 2.72rem;
  background: linear-gradient(99deg, #49d8ff -86.38%, #269aed 148.91%);
  border: none;
  font-family: "Pretendard Variable", sans-serif;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ButtonText = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-weight: 800;
  font-size: 1.5625rem;
  color: white;
  letter-spacing: 3%;
`;
