import React, { useMemo, useState } from "react";
import styled from "styled-components";
import UpgradeCard from "./UpgradeCard";
import UpgradeCardDetail from "./UpgradeCardDetail";

export default function UpgradeSection({
  upgrades,
  onAccept,
  onCancel,
  onEdit,
}) {
  const [selectedUpgradeId, setSelectedUpgradeId] = useState(null);

  const hasUpgrades = Array.isArray(upgrades) && upgrades.length > 0;
  const selectedUpgrade = useMemo(() => {
    if (!hasUpgrades) {
      return null;
    }

    return upgrades.find((upgrade) => upgrade.id === selectedUpgradeId) ?? null;
  }, [hasUpgrades, upgrades, selectedUpgradeId]);

  const handleCardSelect = (upgradeId) => {
    setSelectedUpgradeId(upgradeId);
  };

  const handleModalClose = () => {
    setSelectedUpgradeId(null);
  };

  if (!hasUpgrades) {
    return null;
  }

  return (
    <>
      <SectionWrapper>
        <SectionTitle>추천</SectionTitle>
        <CardsContainer>
          {upgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.id}
              title={upgrade.title}
              content={upgrade.content}
              isApplied={upgrade.isApplied}
              onClick={() => handleCardSelect(upgrade.id)}
              footer={
                upgrade.isApplied
                  ? "적용됨"
                  : `${upgrade.direction ?? "업그레이드"} 보기`
              }
            />
          ))}
        </CardsContainer>
      </SectionWrapper>

      <UpgradeCardDetail
        upgrade={selectedUpgrade}
        onAccept={onAccept}
        onCancel={onCancel}
        onEdit={onEdit}
        onClose={handleModalClose}
      />
    </>
  );
}

// Styled Components
const SectionWrapper = styled.div`
  width: 100%;
  padding: 3vh 1.77vw 0; /* 50px 34px 0 @ 1920x1080 */
  background-color: #ffffff;
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
