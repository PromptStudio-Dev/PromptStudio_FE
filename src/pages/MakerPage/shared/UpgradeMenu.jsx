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
  width: 145px;
  background: #ffffff;
  border: 0.5px solid #848484;
  border-radius: 8px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 10000; /* 최상위에 표시 */
  margin-top: 4px;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  height: 49px;
  padding: 13px 20px;
  background: #ffffff;
  border: none;
  border-bottom: 0.5px solid #848484;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 8px 8px;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:hover {
    background-color: #f6fcff;
  }
`;

const CheckIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const DeleteIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const EditIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const MenuText = styled.span`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  letter-spacing: -0.28px;
`;
