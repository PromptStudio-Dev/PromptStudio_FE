import React from "react";
import styled from "styled-components";
import AIModalSelector from "../components/AIModalSelctor";
import CloseIconImage from "../../../assets/icon/tabler_chevrons-close.svg";

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
        <CloseIcon src={CloseIconImage} />
      </CloseButton>
    </ResultPanelWrapper>
  );
}

export default ResultPanel;

const ResultPanelWrapper = styled.div`
  width: 31.77vw; /* 610px / 1920px */
  height: 100%;
  background-color: #f4f4f4;
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
  background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    linear-gradient(90deg, rgb(166, 166, 166) 0%, rgb(166, 166, 166) 100%);
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
    background-color: #c0c0c0;
  }
`;

const CloseIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;
