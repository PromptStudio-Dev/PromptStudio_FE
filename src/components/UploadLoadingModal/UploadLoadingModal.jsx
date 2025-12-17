import React from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import LoadingAnimation from "../../pages/UploadPage/assets/Loading.json";

export default function UploadLoadingModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <ModalText>프롬프트가 올라가는 중이에요</ModalText>
        <AnimationWrapper>
          <Lottie animationData={LoadingAnimation} loop={true} />
        </AnimationWrapper>
      </ModalContainer>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20vw;
  height: auto;
  border-radius: 1.625rem;
  background: #282828;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16);
`;

const ModalText = styled.div`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  margin-top: 1.5rem;
  line-height: normal;
  text-align: center;
`;

const AnimationWrapper = styled.div`
  width: 100%;
  max-width: 15rem;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;
