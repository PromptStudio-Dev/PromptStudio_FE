import React, { useState, useEffect } from "react";
import UpgradeMenu from "./UpgradeMenu";
import styled from "styled-components";
import PromptUpgradeIcon from "../assets/prompt-upgrade-icon.svg";
import PromptUpgradeButton from "../assets/prompt-upgrade-button.svg";
import Lottie from "lottie-react";
import inlineLoadingAnimation from "../assets/Inline Loading.json";

export default function AIUpgradeModal({
  position,
  onSubmit,
  onAcceptUpgrade,
  onCancelUpgrade,
  onEditUpgrade,
  activeUpgradeId,
  isLoading = false,
  modalRef,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsSubmitted(false);
    }
  }, [isLoading]);
  // activeUpgradeId가 생기면 자동으로 메뉴 표시 및 모달 재활성화
  useEffect(() => {
    if (activeUpgradeId != null) {
      setShowMenu(true);
      // 업그레이드 결과가 나오면 모달을 다시 활성화 (입력 가능한 상태로)
      setIsSubmitted(false);
      setInputValue(""); // 입력값 초기화
    }
  }, [activeUpgradeId]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue("");
      setIsSubmitted(true); // 전송됨 상태로 변경
    }
  };

  // 전송 버튼 뿐만 아니라 엔터키 입력 시 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleLeftButtonMouseEnter = () => {
    if (isSubmitted) {
      setShowMenu(true);
    }
  };

  // 드래그 모달에서 실제 수락/취소/수정 가능
  const handleAccept = (upgradeId) => {
    if (upgradeId == null) return;
    setShowMenu(false);
    onAcceptUpgrade?.(upgradeId);
  };

  const handleCancel = (upgradeId) => {
    if (upgradeId == null) return;
    setShowMenu(false);
    onCancelUpgrade?.(upgradeId);
  };

  const handleEdit = (upgradeId) => {
    if (upgradeId == null) return;
    setShowMenu(false);
    onEditUpgrade?.(upgradeId);
  };

  // 재업그레이드 시에도 로딩 표시: isSubmitted가 true이고, activeUpgradeId가 아직 업데이트되지 않았거나 변경 중일 때

  return (
    <SelectionModal
      ref={modalRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {isLoading ? (
        <LoadingSection>
          <LoadingAnimationWrapper>
            <Lottie animationData={inlineLoadingAnimation} loop={true} />
          </LoadingAnimationWrapper>
          <LoadingText>흩어진 프롬프트 파도 모으는 중..</LoadingText>
          <LoadingAnimationWrapper>
            <Lottie animationData={inlineLoadingAnimation} loop={true} />
          </LoadingAnimationWrapper>
        </LoadingSection>
      ) : (
        <>
          <LeftSection onMouseEnter={handleLeftButtonMouseEnter}>
            <LeftButton>AI 맞춤 추천</LeftButton>
            <UpgradeMenu
              isVisible={showMenu}
              onAccept={() => handleAccept(activeUpgradeId)}
              onCancel={() => handleCancel(activeUpgradeId)}
              onEdit={() => handleEdit(activeUpgradeId)}
            />
          </LeftSection>
          <MiddleSection>
            <UpgradeIcon src={PromptUpgradeIcon} alt="업그레이드 아이콘" />
            <UpgradeInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="AI 사용으로 업그레이드하기"
              disabled={isSubmitted}
            />
            {!isSubmitted && (
              <UpgradeButton onClick={handleSubmit}>
                <ButtonIcon src={PromptUpgradeButton} alt="업그레이드 버튼" />
              </UpgradeButton>
            )}
          </MiddleSection>
        </>
      )}
    </SelectionModal>
  );
}

// --- styled-components ---

const SelectionModal = styled.div`
  position: fixed;
  display: flex;
  width: 49.1875rem;
  min-height: 2.875rem;
  border: 0.125rem solid #49d8ff;
  border-radius: 0.5rem;
  background: #fff;
  overflow: visible; /* 드롭다운 메뉴가 보이도록 변경 */
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-0.37vh);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LeftSection = styled.div`
  width: 7.55vw; /* 145px @ 1920px */
  min-height: 2.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 0.1875rem solid #49d8ff; /* 3px @ 1920px */
  margin-right: 1rem;
  position: relative;
`;

const LeftButton = styled.button`
  background: transparent;
  border: none;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #454545;
  cursor: pointer;
  white-space: nowrap;
`;

const MiddleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5vw; /* 16px @ 1920px */
`;

const UpgradeInput = styled.input`
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  font-size: 1rem; /* 23px @ 1920px */
  font-family: "Pretendard Variable", sans-serif;
  font-weight: 500;
  color: #454545;

  &::placeholder {
    color: #a6a6a6;
    font-size: 1rem;
  }

  &:disabled {
    color: #454545;
    cursor: default;
  }
`;

const UpgradeIcon = styled.img`
  width: 1.25vw; /* 24px @ 1920px */
  height: 2.22vh; /* 24px @ 1080px */
`;

const ButtonIcon = styled.img`
  width: 3vw; /* 24px @ 1920px */
  height: 3vh; /* 24px @ 1080px */
`;

const UpgradeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const LoadingSection = styled.div`
  width: 100%;
  height: 2.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const LoadingAnimationWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 1;
`;

const LoadingText = styled.div`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #49d8ff;
`;
