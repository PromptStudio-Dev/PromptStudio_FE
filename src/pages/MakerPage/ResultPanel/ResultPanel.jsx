import React, { useState } from "react";
import styled from "styled-components";
import AIModalSelector from "../MainPanel/AIModalSelector";
import ResultPanelCloseImg from "../assets/prompt-run-close.svg";
import ResultDisplay from "../shared/ResultDisplay";
import HistoryBar from "../shared/HistoryBar";
import ResultFeedback from "../shared/ResultFeedback";

export default function ResultPanel({
  isOpen = true,
  onToggle,
  onRun,
  currentHistoryIndex = 3,
  historyItems = [],
  onHistoryItemClick,
  resultImageUrl = null,
  resultText = null,
  isResultLoading = false,
  feedbackText = null,
  isSidebarOpen = true,
  isResultPanelExpanded = false,
  onExpandChange,
}) {
  const [activeTab, setActiveTab] = useState("HISTORY"); // "HISTORY" | "FEEDBACK"

  return (
    <ResultPanelWrapper
      $isOpen={isOpen}
      $isExpanded={isResultPanelExpanded}
      $isSidebarOpen={isSidebarOpen}
    >
      <ResultPanelHeader $isExpanded={isResultPanelExpanded}>
        {!isResultPanelExpanded && <AIModalSelector />}
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
      <ResultContent $isExpanded={isResultPanelExpanded}>
        <ContentWrapper>
          <ResultDisplayWrapper $isExpanded={isResultPanelExpanded}>
            <ResultDisplay
              isLoading={isResultLoading}
              imageUrl={resultImageUrl}
              textContent={resultText}
              onExpand={() => {
                if (onExpandChange) {
                  onExpandChange(!isResultPanelExpanded);
                }
              }}
              isExpanded={isResultPanelExpanded}
            />
          </ResultDisplayWrapper>

          <BottomSection $isExpanded={isResultPanelExpanded}>
            <TabHeader>
              <TabButton
                type="button"
                data-active={activeTab === "HISTORY"}
                onClick={() => setActiveTab("HISTORY")}
              >
                <TabTitle>History</TabTitle>
                <TabCount>
                  ({currentHistoryIndex}/{historyItems.length || 0})
                </TabCount>
              </TabButton>
              <TabButton
                type="button"
                data-active={activeTab === "FEEDBACK"}
                onClick={() => setActiveTab("FEEDBACK")}
              >
                <TabTitle>Feedback</TabTitle>
              </TabButton>
            </TabHeader>
            <TabContentWrapper>
              {activeTab === "HISTORY" ? (
                <TabInnerHistory>
                  <HistoryBar
                    currentIndex={currentHistoryIndex}
                    totalCount={historyItems.length || 10}
                    historyItems={historyItems}
                    onItemClick={onHistoryItemClick}
                  />
                </TabInnerHistory>
              ) : (
                <TabInnerFeedback>
                  <ResultFeedback feedbackText={feedbackText} />
                </TabInnerFeedback>
              )}
            </TabContentWrapper>
          </BottomSection>
        </ContentWrapper>
      </ResultContent>
    </ResultPanelWrapper>
  );
}

const ResultPanelWrapper = styled.div`
  width: ${(props) => {
    if (props.$isExpanded) {
      // 확장 시: SidePanel이 열려있으면 그 너비만큼 빼기
      return props.$isSidebarOpen ? "calc(100% - 28.5625rem)" : "100%";
    }
    return "36.0625rem"; // 기본 너비
  }};
  height: 100%;
  background-color: #ffffff;
  position: absolute;
  right: 0;
  top: 0;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 10;
  border-left: ${(props) =>
    props.$isExpanded ? "none" : "0.0625rem solid #49d8ff"};
  transition: width 0.3s ease;
`;

const ResultPanelHeader = styled.div`
  padding: ${(props) =>
    props.$isExpanded ? "1.75rem 5.69rem" : "1.25rem 0rem"};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$isExpanded ? "flex-end" : "space-between"};
  gap: 0;
`;

const ResultContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${(props) => (props.$isExpanded ? "0" : "3rem 2.75rem 0 2.75rem")};
  display: flex;
  flex-direction: column;
  gap: 0; /* 세로선이 전체를 채우도록 간격 없음 */
  align-items: stretch;
  min-height: 0; /* flex 자식이 overflow를 올바르게 처리하도록 */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0; /* 줄어들지 않도록 */
  min-height: min-content;
  margin-top: auto; /* 아래로 밀어서 여백 없애기 */
`;

const ResultDisplayWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$isExpanded ? "flex-start" : "stretch")};
  align-items: ${(props) => (props.$isExpanded ? "flex-start" : "stretch")};
  padding: ${(props) =>
    props.$isExpanded ? "1.75rem 0 1.75rem 5.625rem" : "0"};
  flex-shrink: 0; /* 크기 고정, 줄어들지 않도록 */
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: ${(props) => (props.$isExpanded ? "62rem" : "100%")};
  padding: ${(props) =>
    props.$isExpanded ? "1.75rem 0 1.75rem 5.625rem" : "0"};
  padding-top: ${(props) => (props.$isExpanded ? "1.75rem" : "3rem")};
  box-sizing: border-box;
  flex: 1 1 auto;
  min-height: 0;
  flex-shrink: 1;
  height: 100%;
  align-items: flex-start;
  justify-content: flex-end;
`;

const TabContentWrapper = styled.div`
  flex: 0 0 auto; /* 고정 높이 */
  width: 100%;
  min-height: 19rem; /* HISTORY와 FEEDBACK 높이를 동일하게 맞춤 */
  height: 19rem; /* 고정 높이 */
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TabInnerHistory = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const TabInnerFeedback = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TabHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2rem;
`;

const TabButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: baseline;
  gap: 0.625rem;
  border-bottom: 0.1875rem solid
    ${(props) => (props["data-active"] ? "#21C3FF" : "transparent")};
  color: ${(props) => (props["data-active"] ? "#000000" : "#A6A6A6")};

  &:hover {
    opacity: 0.9;
  }
`;

const TabTitle = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4375rem;
  font-weight: 700;
`;

const TabCount = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #848484;
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
