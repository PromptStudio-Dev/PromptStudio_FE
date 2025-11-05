import React from "react";
import styled from "styled-components";
import UpgradeCard from "./UpgradeCard";

function UpgradeSection({ upgrades, onAccept, onCancel, onEdit }) {
  if (!upgrades || upgrades.length === 0) {
    return null;
  }

  return (
    <SectionWrapper>
      <SectionTitle>업그레이드</SectionTitle>
      <CardsContainer>
        {upgrades.map((upgrade, index) => (
          <UpgradeCard
            key={upgrade.id || index}
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

export default UpgradeSection;

// Styled Components
const SectionWrapper = styled.div`
  width: 100%;
  padding: 50px 34px 0 34px;
  background-color: #ffffff;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 26px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
  margin: 0 0 50px 0;
`;

const CardsContainer = styled.div`
  width: 100%;
  padding: 0 13px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
