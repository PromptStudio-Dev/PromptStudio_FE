import React, { useMemo, useState } from "react";
import styled from "styled-components";
import UpgradeCard from "./UpgradeCard";
import UpgradeCardDetail from "./UpgradeCardDetail";
import UpgradeAgainButtonImg from "../assets/upgrade-again-button.svg";

export default function UpgradeSection({
  upgrades,
  onAccept,
  onCancel,
  onEdit,
  onReupgrade,
}) {
  const [selectedUpgradeId, setSelectedUpgradeId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleReupgrade = async () => {
    setIsRefreshing(true);
    try {
      await onReupgrade?.();
    } catch (error) {
      console.error("재업그레이드 실패:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!hasUpgrades) {
    return null;
  }

  return (
    <>
      <SectionWrapper>
        <SectionHeader>
          <SectionTitle>업그레이드 결과</SectionTitle>
          <UpgradeAgainButton onClick={handleReupgrade} disabled={isRefreshing}>
            {isRefreshing ? (
              <LoadingSpinner />
            ) : (
              <>
                <UpgradeAgainButtonText>새로고침</UpgradeAgainButtonText>
                <UpgradeAgainButtonImage src={UpgradeAgainButtonImg} />
              </>
            )}
          </UpgradeAgainButton>
        </SectionHeader>
        <CardsContainer>
          {upgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.id}
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

const UpgradeAgainButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 7.5rem;
  padding: 0.19rem 1rem;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const UpgradeAgainButtonText = styled.p`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #848484;
  line-height: 1.625rem;
`;

const UpgradeAgainButtonImage = styled.img`
  width: 1.1875rem;
  height: auto;
`;

const SectionWrapper = styled.div`
  width: 100%;
  padding: 3vh 1.77vw 0; /* 50px 34px 0 @ 1920x1080 */
  background-color: #ffffff;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.68vw;
`;

const SectionTitle = styled.h2`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.625rem; /* 26px */
  font-weight: 600;
  line-height: normal;
  color: #000000;
  margin: 0;
`;

const HeaderButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f2f2f2;
  color: #000000;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const CardsContainer = styled.div`
  width: 100%;
  padding: 0 0.68vw; /* 13px @ 1920px */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
`;

const LoadingSpinner = styled.div`
  width: 1.1875rem;
  height: 1.1875rem;
  border: 0.125rem solid #e0e0e0;
  border-top: 0.125rem solid #49d8ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
