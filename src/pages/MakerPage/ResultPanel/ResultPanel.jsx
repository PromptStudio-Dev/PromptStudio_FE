import React from "react";
import styled from "styled-components";
import AIModalSelector from "./AIModalSelector";
import ResultPanelCloseImg from "../../../assets/icon/panel-close-open.svg";

function ResultPanel({ onToggle }) {
  return (
    <ResultPanelWrapper>
      <ResultPanelHeader>
        <AIModalSelector />
        <RunButton>
          <ButtonText>PROMPT</ButtonText>
          <ButtonText>RUN</ButtonText>
        </RunButton>
      </ResultPanelHeader>

      <ResultContent>{/* 결과 표시 영역 */}</ResultContent>

      <CloseButton onClick={onToggle} aria-label="결과 패널 닫기">
        <CloseIcon src={ResultPanelCloseImg} />
      </CloseButton>
    </ResultPanelWrapper>
  );
}

export default ResultPanel;

const ResultPanelWrapper = styled.div`
  width: 31.77vw;
  height: 100%;
  background-color: #f4fbfd;
  box-shadow: -5px 0px 26px 0px rgba(0, 0, 0, 0.06);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ResultPanelHeader = styled.div`
  padding: 2vh 1.6vw;
  display: flex;
  align-items: center;
  gap: 1vw;
`;

const RunButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18vw;
  height: auto;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #49d8ff;
  border: none;
  border-radius: 12px;
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
  font-size: 1.44rem;
  color: white;
  letter-spacing: 1.38px;
`;

const ResultContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2vh 1.6vw;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 100%;
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
    background-color: #c0c0c0;
  }
`;

const CloseIcon = styled.img`
  width: auto;
  height: 2.5vh;
`;
