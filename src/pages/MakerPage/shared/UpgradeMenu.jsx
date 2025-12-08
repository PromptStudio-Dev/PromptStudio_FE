import React from "react";
import styled from "styled-components";
import CheckIconImg from "../assets/check-prompt-upgrade.svg";
import DeleteIconImg from "../assets/cancel-prompt-upgrade.svg";
import EditIconImg from "../assets/edit-prompt-upgrade.svg";

export default function UpgradeMenu({ onAccept, onCancel, onEdit, isVisible }) {
  if (!isVisible) return null;

  return (
    <MenuWrapper>
      <MenuItem onClick={onAccept}>
        <CheckIcon src={CheckIconImg} />
        <MenuText>수락</MenuText>
      </MenuItem>
      <MenuItem onClick={onCancel}>
        <DeleteIcon src={DeleteIconImg} />
        <MenuText>취소</MenuText>
      </MenuItem>
      <MenuItem onClick={onEdit}>
        <EditIcon src={EditIconImg} />
        <MenuText>아래에 삽입</MenuText>
      </MenuItem>
    </MenuWrapper>
  );
}

// Styled Components

const MenuWrapper = styled.div`
  position: absolute;
  top: 100%; /* LeftSection 바로 아래 */
  left: -10;
  display: flex;
  flex-direction: column;
  background: transparent;
  box-shadow: 0 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 10000;
  margin-top: 0.25rem;
  border-radius: 0.5rem;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6875rem;
  height: 3.0625rem;
  padding: 0.8125rem 1.25rem;
  background: #ffffff;
  border: none;
  border-bottom: 0.03125rem solid #848484;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 0.5rem 0.5rem;
  }

  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }

  &:hover {
    background-color: #f6fcff;
  }
`;

const CheckIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const DeleteIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const EditIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const MenuText = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000000;
  letter-spacing: -0.0175rem;
  white-space: nowrap;
`;
