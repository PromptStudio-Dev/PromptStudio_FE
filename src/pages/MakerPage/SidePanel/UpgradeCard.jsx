import React from "react";
import styled, { css } from "styled-components";

export default function UpgradeCard({ title, content, isApplied, onClick }) {
  return (
    <CardWrapper $isApplied={isApplied}>
      {title && <CardTitle $isApplied={isApplied}>{title}</CardTitle>}
      <CardContentWrapper
        $isApplied={isApplied}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.();
          }
        }}
      >
        <UpgradedText $isApplied={isApplied}>{content}</UpgradedText>
      </CardContentWrapper>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 18.91vw; /* 363px @ 1920px */
  margin-bottom: 1rem; /* 16px */
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardTitle = styled.p`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  color: ${(props) => (props.$isApplied ? "#00aeff" : "#001e40")};
  margin: 0;
`;

const CardContentWrapper = styled.div`
  width: 100%;
  min-height: 15.46vh;
  background-color: ${(props) => (props.$isApplied ? "#001e40" : "#e0f5ff")};
  border-radius: 0.83vw;
  padding: 2.41vh 1.09vw;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  outline: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 174, 255, 0.45);
  }
`;

const baseTextStyles = css`
  width: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.125rem; /* 18px */
  font-weight: 400;
  line-height: 1.6;
  white-space: pre-line;
`;

const UpgradedText = styled.div`
  ${baseTextStyles}
  color: ${(props) => (props.$isApplied ? "#ffffff" : "#001e40")};
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
`;

const CardFooter = styled.div`
  ${baseTextStyles}
  font-size: 0.95rem;
  color: ${(props) => (props.$isApplied ? "#bde8ff" : "#2b4a5e")};
  z-index: 1;
`;
