import React from "react";
import styled from "styled-components";
import UpgradeCard from "./UpgradeCard";

export default function UpgradeSection({
  upgrades,
  onAccept,
  onCancel,
  onEdit,
}) {
  if (!upgrades || upgrades.length === 0) {
    return null;
  }

  return (
    <SectionWrapper>
      <SectionTitle>업그레이드</SectionTitle>
      <CardsContainer>
        {upgrades.map((upgrade) => (
          <UpgradeCard
            key={upgrade.id}
            title={upgrade.title}
            content={upgrade.content}
            isApplied={upgrade.isApplied}
            onAccept={() => onAccept?.(upgrade.id)}
            onCancel={() => onCancel?.(upgrade.id)}
            onEdit={() => onEdit?.(upgrade.id)}
          />
        ))}
      </CardsContainer>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled.div`
  width: 100%;
  padding: 3vh 1.77vw 0; /* 50px 34px 0 @ 1920x1080 */
  background-color: #ffffff;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.625rem; /* 26px */
  font-weight: 600;
  line-height: normal;
  color: #000000;
  margin: 0 0 1rem 0; /* 50px */
`;

const CardsContainer = styled.div`
  width: 100%;
  padding: 0 0.68vw; /* 13px @ 1920px */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
`;
