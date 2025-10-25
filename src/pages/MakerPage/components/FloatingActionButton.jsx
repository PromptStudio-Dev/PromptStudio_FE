import React from "react";
import styled from "styled-components";

function FloatingActionButton({ onClick }) {
  return (
    <FABButton onClick={onClick} aria-label="프롬프트 추가">
      <PlusIcon>+</PlusIcon>
    </FABButton>
  );
}

export default FloatingActionButton;

const FABButton = styled.button`
  position: fixed;
  bottom: 4vh;
  right: 4vw;
  width: 3.125vw; /* 60px / 1920px */
  height: 5.56vh; /* 60px / 1080px */
  border-radius: 50%;
  background: linear-gradient(135deg, #00aeff 0%, #0088cc 100%);
  border: none;
  box-shadow: 0 0.37vh 1.11vh rgba(0, 174, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0.56vh 1.48vh rgba(0, 174, 255, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PlusIcon = styled.span`
  font-size: 2rem;
  color: white;
  font-weight: 300;
  line-height: 1;
`;
