import React from "react";
import styled, { css } from "styled-components";

export default function UpgradeCard({ title, content, isApplied }) {
  return (
    <CardWrapper $isApplied={isApplied}>
      <CardTitle $isApplied={isApplied}>{title}</CardTitle>
      <CardContentWrapper $isApplied={isApplied}>
        <UpgradedText $isApplied={isApplied}>{content}</UpgradedText>
      </CardContentWrapper>
    </CardWrapper>
  );
}

// Styled Components
const CardWrapper = styled.div`
  width: 18.91vw; /* 363px @ 1920px */
  margin-bottom: 1rem; /* 16px */
  position: relative;
`;

const CardTitle = styled.p`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4375rem;
  font-weight: 600;
  line-height: normal;
  color: ${(props) => (props.$isApplied ? "#00aeff" : "#000000")};
  margin: 0 0 1rem 0;
`;

const CardContentWrapper = styled.div`
  width: 100%;
  height: 15.46vh;
  background-color: ${(props) => (props.$isApplied ? "#001e40" : "#e0f5ff")};
  border-radius: 0.83vw;
  padding: 2.41vh 1.09vw;
  overflow-y: auto;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const baseTextStyles = css`
  width: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4375rem; /* 23px */
  font-weight: 400;
  line-height: 1.4;
  white-space: pre-wrap;
`;

const UpgradedText = styled.div`
  ${baseTextStyles}
  color: ${(props) => (props.$isApplied ? "#ffffff" : "#000000")};
`;
