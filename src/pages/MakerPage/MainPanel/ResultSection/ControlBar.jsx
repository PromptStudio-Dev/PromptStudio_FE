import React from "react";
import styled from "styled-components";
import AIModalSelector from "../AIModalSelector";
import ResultPanelOpenImg from "../../assets/prompt-run-open-disabled.svg";

export default function ControlBar({ onRun }) {
  return (
    <ControlBarWrapper>
      <AIModalSelector />
      <SecondWrapper>
        <RunButton onClick={onRun}>
          <ButtonText>PROMPT</ButtonText>
          <ButtonText>RUN</ButtonText>
        </RunButton>
        <OpenResultPanelButton src={ResultPanelOpenImg} />
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
