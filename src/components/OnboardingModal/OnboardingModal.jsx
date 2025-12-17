import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Onboarding1 from "./modalImage/Onboarding_1.svg";
import Onboarding2 from "./modalImage/Onboarding_2.svg";
import Onboarding3 from "./modalImage/Onboarding_3.svg";
import MakerOnboarding1 from "./modalImage/makerOnboarding_1.svg";
import MakerOnboarding2 from "./modalImage/makerOnboarding_2.svg";
import MakerOnboarding3 from "./modalImage/makerOnboarding_3.svg";
import ArrowIconSvg from "./modalImage/arrowIcon.svg";

const ONBOARDING_KEY = "hasSeenOnboarding";
const MAKER_ONBOARDING_KEY = "hasSeenMakerOnboarding";

// 기본 온보딩 이미지 슬라이드 (HubPage용)
const DEFAULT_SLIDES = [
  { image: Onboarding1, alt: "온보딩 1" },
  { image: Onboarding2, alt: "온보딩 2" },
  { image: Onboarding3, alt: "온보딩 3" },
];

// MakerPage용 온보딩 이미지 슬라이드
const MAKER_SLIDES = [
  { image: MakerOnboarding1, alt: "메이커 온보딩 1" },
  { image: MakerOnboarding2, alt: "메이커 온보딩 2" },
  { image: MakerOnboarding3, alt: "메이커 온보딩 3" },
];

// 화살표 아이콘 컴포넌트
const ArrowIcon = ({ direction = "right" }) => (
  <ArrowIconImg
    src={ArrowIconSvg}
    alt={direction === "left" ? "이전" : "다음"}
    $direction={direction}
  />
);

export default function OnboardingModal({
  isOpen,
  onClose,
  slides = DEFAULT_SLIDES, // 기본값으로 온보딩 이미지 사용
  onboardingKey = ONBOARDING_KEY, // 기본값은 HubPage용 키
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  // slides가 비어있어도 기본 슬라이드 제공
  const effectiveSlides =
    slides.length > 0 ? slides : [{ image: "", alt: "온보딩" }];

  const handleNext = () => {
    if (currentSlide < effectiveSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(onboardingKey, "true");
    onClose();
  };

  const handleSkip = () => {
    handleComplete();
  };

  useEffect(() => {
    console.log(
      "[온보딩 모달] isOpen:",
      isOpen,
      "slides.length:",
      slides.length,
      "effectiveSlides.length:",
      effectiveSlides.length
    );
  }, [isOpen, slides.length, effectiveSlides.length]);

  if (!isOpen) return null;

  const currentImage = effectiveSlides[currentSlide]?.image;
  const isFirstSlide = currentSlide === 0;

  return (
    <Overlay>
      <ModalContainer>
        {/* 이전 버튼, 이미지, 다음 버튼을 수평 배치 */}
        <RowContainer>
          {/* 이전 버튼 (좌측) - 항상 렌더링하되 첫 슬라이드에서는 보이지 않게 */}
          <NavButton
            $position="left"
            $isVisible={!isFirstSlide}
            onClick={handlePrev}
          >
            <ArrowIcon direction="left" />
          </NavButton>
          {/* 이미지 영역 (기존 모달 크기) */}
          <ImageContainer>
            {currentImage ? (
              <ModalImage
                src={currentImage}
                alt={effectiveSlides[currentSlide]?.alt || ""}
              />
            ) : (
              <ModalPlaceholder>
                <PlaceholderText>온보딩 이미지</PlaceholderText>
                <PlaceholderSubtext>
                  이미지 경로를 설정해주세요
                </PlaceholderSubtext>
              </ModalPlaceholder>
            )}
          </ImageContainer>
          {/* 다음 버튼 (우측) */}
          <NavButton $position="right" onClick={handleNext}>
            <ArrowIcon direction="right" />
          </NavButton>
        </RowContainer>
        {/* Skip 버튼 (하단) */}
        <SkipButtonContainer>
          <SkipButton onClick={handleSkip}>Skip</SkipButton>
        </SkipButtonContainer>
      </ModalContainer>
    </Overlay>
  );
}

// 온보딩을 이미 본 적 있는지 확인하는 함수
export const hasSeenOnboarding = () => {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
};

// MakerPage 온보딩을 이미 본 적 있는지 확인하는 함수
export const hasSeenMakerOnboarding = () => {
  return localStorage.getItem(MAKER_ONBOARDING_KEY) === "true";
};

// 온보딩 상태 초기화 (개발/테스트용)
export const resetOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY);
};

// MakerPage 온보딩 상태 초기화 (개발/테스트용)
export const resetMakerOnboarding = () => {
  localStorage.removeItem(MAKER_ONBOARDING_KEY);
};

// 모든 온보딩 상태 초기화 (개발/테스트용)
export const resetAllOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(MAKER_ONBOARDING_KEY);
};

// MakerPage용 슬라이드 getter 함수 (Fast Refresh 호환)
export const getMakerSlides = () => MAKER_SLIDES;
export const getMakerOnboardingKey = () => MAKER_ONBOARDING_KEY;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  /* Skip 버튼이 모달 밖에 위치할 수 있도록 */
  overflow: visible;
`;

const ModalContainer = styled.div`
  position: relative;
  width: calc(75vw + 2.5625rem * 2); /* 이미지 너비 + 좌우 버튼 공간 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; /* Skip 버튼과의 간격 */
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 75vw;
  height: calc(75vw * 0.562); /* width의 56.2% */
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ModalPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const PlaceholderText = styled.div`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 2rem;
  font-weight: 700;
`;

const PlaceholderSubtext = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-family: "Pretendard Variable";
  font-size: 1.25rem;
  font-weight: 500;
`;

const NavButton = styled.button`
  width: 2.5625rem; /* 41px */
  height: 5.125rem; /* 82px (41px * 2) */
  background: #fff;
  border: none;
  border-radius: ${({ $position }) =>
    $position === "left"
      ? "2.25rem 0 0 2.25rem" /* 왼쪽이 둥글게 */
      : "0 2.25rem 2.25rem 0"}; /* 오른쪽이 둥글게 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $isVisible }) => ($isVisible !== false ? "pointer" : "default")};
  transition: opacity 0.2s ease, background-color 0.2s ease,
    visibility 0.2s ease;
  flex-shrink: 0;
  visibility: ${({ $isVisible }) =>
    $isVisible !== false ? "visible" : "hidden"};
  opacity: ${({ $isVisible }) => ($isVisible !== false ? "1" : "0")};
  pointer-events: ${({ $isVisible }) =>
    $isVisible !== false ? "auto" : "none"};

  &:hover {
    opacity: 0.9;
    background: #f5f5f5;
  }

  &:active {
    opacity: 0.8;
  }
`;

const ArrowIconImg = styled.img`
  width: 0.78625rem;
  height: 1.359rem;
  transform: ${({ $direction }) =>
    $direction === "left" ? "scaleX(-1)" : "none"};
`;

const SkipButtonContainer = styled.div`
  width: 75vw; /* ImageContainer와 같은 너비 */
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
`;

const SkipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.5rem;
  height: 2.5rem;
  padding: 0.44rem 1.39rem;
  background: transparent;
  border: none;
  color: var(--B-Blue-line, #00aeff);
  font-family: "Instrument Sans", sans-serif;
  font-size: 1.22225rem;
  border-radius: 0.55556rem;
  background: var(--White, #fff);
  font-style: normal;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;
