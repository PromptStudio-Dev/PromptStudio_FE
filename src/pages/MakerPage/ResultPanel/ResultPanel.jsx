import React from "react";
import styled from "styled-components";
import AIModalSelector from "../MainPanel/AIModalSelector";
import ResultPanelCloseImg from "../assets/prompt-run-close.svg";
import ResultDisplay from "../shared/ResultDisplay";
import HistoryBar from "../shared/HistoryBar";

export default function ResultPanel({
  isOpen = true,
  onToggle,
  onRun,
  currentHistoryIndex = 3,
  historyItems = [],
  onHistoryItemClick,
  resultImageUrl = null,
  isResultLoading = false,
}) {
  return (
    <ResultPanelWrapper $isOpen={isOpen}>
      <ResultPanelHeader>
        <AIModalSelector />
        <SecondWrapper>
          <RunButton onClick={onRun}>
            <ButtonText>PROMPT</ButtonText>
            <ButtonText>RUN</ButtonText>
          </RunButton>
          <OpenResultPanelButton
            src={ResultPanelCloseImg}
            onClick={onToggle}
            alt="결과 패널 닫기"
          />
        </SecondWrapper>
      </ResultPanelHeader>
      <ResultContent>
        <ResultDisplay isLoading={isResultLoading} imageUrl={resultImageUrl} />
        <HistoryBar
          currentIndex={currentHistoryIndex}
          totalCount={historyItems.length || 10}
          historyItems={historyItems}
          onItemClick={onHistoryItemClick}
        />
      </ResultContent>
    </ResultPanelWrapper>
  );
}

const ResultPanelWrapper = styled.div`
  width: 36.0625rem; /* 기본 너비 (rem 기준) */
  height: 100%;
  background-color: #ffffff;
  position: absolute;
  right: 0;
  top: 0;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 10;
  border-left: 0.0625rem solid #49d8ff;
`;

const ResultPanelHeader = styled.div`
  padding: 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0;
`;

const ResultContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SecondWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OpenResultPanelButton = styled.img`
  width: 2.25rem;
  height: auto;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.95);
  }
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
