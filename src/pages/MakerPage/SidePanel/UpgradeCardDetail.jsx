import React from "react";
import styled from "styled-components";

export default function UpgradeCardDetail({
  upgrade,
  onAccept,
  onCancel,
  onEdit,
  onClose,
}) {
  if (!upgrade) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer role="dialog" aria-modal="true">
        <ModalHeader>
          <div>
            <ModalTitle>{upgrade.title ?? "업그레이드 상세"}</ModalTitle>
          </div>
          <ModalCloseButton onClick={onClose}>닫기</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {upgrade.originalText && (
            <ModalSection>
              <ModalSectionTitle>원본 텍스트</ModalSectionTitle>
              <ModalTextBlock>{upgrade.originalText}</ModalTextBlock>
            </ModalSection>
          )}

          <ModalSection>
            <ModalSectionTitle>업그레이드 제안</ModalSectionTitle>
            <ModalTextBlock>{upgrade.content}</ModalTextBlock>
          </ModalSection>
        </ModalBody>

        <ModalRange>
          {upgrade.selectionRange && (
            <ModalMeta>
              <li>
                <span>선택 범위</span>
                <strong>
                  {upgrade.selectionRange.start ?? 0} ~{" "}
                  {upgrade.selectionRange.end ?? 0}
                </strong>
              </li>
            </ModalMeta>
          )}
        </ModalRange>

        <ModalFooter>
          <ModalFooterLeft>
            <ModalFooterButton
              type="button"
              onClick={() => {
                onCancel?.(upgrade.id);
                onClose?.();
              }}
            >
              거절
            </ModalFooterButton>
            <ModalFooterButton
              type="button"
              onClick={() => {
                onEdit?.(upgrade.id);
                onClose?.();
              }}
            >
              아래에 삽입
            </ModalFooterButton>
          </ModalFooterLeft>
          <ModalPrimaryButton
            type="button"
            onClick={() => {
              onAccept?.(upgrade.id);
              onClose?.();
            }}
          >
            업그레이드 적용
          </ModalPrimaryButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 16, 40, 0.56);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  width: 77.375rem; /* 고정 너비 */
  min-height: 41.5625rem; /* 최소 높이 */
  max-height: 59.375rem; /* 최대 높이 */
  background: #ffffff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 28px 60px rgba(12, 21, 41, 0.18);
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.75rem 2rem 1.25rem;
  border-bottom: 0.125rem solid #aadff7;
`;

const ModalTitle = styled.h3`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;
const ModalCloseButton = styled.button`
  font-size: 1.1875rem;
  color: #454545;
  background: #ebf1f4;
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const ModalBody = styled.div`
  padding: 1.75rem 2rem;
  flex: 1 1 auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModalSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ModalSectionTitle = styled.h4`
  margin: 0;
  font-size: 1.4375rem;
  font-weight: 700;
  color: #000000;
`;

const ModalTextBlock = styled.pre`
  margin: 0;
  padding: 1rem 1.25rem;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
  font-weight: 400;
  line-height: 1.7;
  color: #24324a;
  white-space: pre-wrap;
`;

const ModalRange = styled.div`
  padding: 0 2rem 0.5rem;
  display: flex;
  flex-direction: column;
  /* flex, overflow-y 전부 빼기 */
`;

const ModalMeta = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0rem;

  li {
    display: flex;
    gap: 0;
    font-size: 0.9rem;
    color: #475569;

    span {
      color: #94a3b8;
      min-width: 4.5rem;
    }

    strong {
      font-weight: 600;
      color: #1e293b;
    }
  }
`;

const ModalFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e4edf6;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const ModalFooterLeft = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const modalButtonBase = `
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.7rem 1.25rem;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease,
    color 0.18s ease;
  border: none;
`;

const ModalFooterButton = styled.button`
  ${modalButtonBase}
  background: #f1f5f9;
  color: #1e293b;

  &:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }
`;

const ModalPrimaryButton = styled.button`
  ${modalButtonBase}
  background: linear-gradient(135deg, rgba(73, 216, 255, 1) 0%, rgba(0, 98, 255, 1) 100%);
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(0, 145, 255, 0.25);

  &:hover {
    box-shadow: 0 14px 32px rgba(0, 145, 255, 0.35);
    transform: translateY(-1px);
  }
`;
