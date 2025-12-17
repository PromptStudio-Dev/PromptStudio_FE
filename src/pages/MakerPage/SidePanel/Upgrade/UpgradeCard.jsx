import React from "react";
import styled, { css } from "styled-components";

export default function UpgradeCard({ content, isApplied, onClick }) {
  return (
    <CardWrapper $isApplied={isApplied}>
      <CardContentWrapper $isApplied={isApplied}>
        <UpgradedText $isApplied={isApplied}>{content}</UpgradedText>
        <MoreButton
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          더보기
        </MoreButton>
      </CardContentWrapper>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin-bottom: 1rem; /* 16px */
  position: relative;
`;

const CardContentWrapper = styled.div`
  width: 22.6875rem;
  max-height: 11.8125rem;
  background: linear-gradient(99deg, #49d8ff -86.38%, #269aed 148.91%);
  border-radius: 1rem;
  padding: 1rem 1.31rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
`;

const baseTextStyles = css`
  width: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-weight: 400;
  line-height: 1.6;
  white-space: pre-line;
`;

const UpgradedText = styled.div`
  ${baseTextStyles}
  color: #ffffff;
  font-size: 1.1875rem;
  font-weight: 700;
  line-height: 1.625rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
`;

const MoreButton = styled.button`
  align-self: flex-end;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  color: #000000;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f9ff;
    transform: translateY(-1px);
  }
`;
