import React from "react";
import styled from "styled-components";

export default function ArchiveCategoryTag({
  img = "",
  isSelected = false,
  name = "default",
  onClick,
}) {
  const hasIcon = Boolean(img);

  return (
    <Tag isSelected={isSelected} onClick={onClick}>
      {hasIcon && <IconImage src={img} alt={name} isSelected={isSelected} />}
      <TagLabel>{name}</TagLabel>
    </Tag>
  );
}

const IconImage = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
  object-fit: contain;
  display: block;
  margin-right: 0.5rem;
  filter: ${({ isSelected }) =>
    isSelected
      ? "brightness(0) invert(1)"
      : "brightness(0) saturate(100%) invert(69%) sepia(93%) saturate(1352%) hue-rotate(156deg) brightness(101%) contrast(101%)"};
  transition: filter 0.2s;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  justify-content: center;
  min-width: 4rem;
  min-height: 2.8125rem;
  border-radius: 7.5rem;
  background: ${({ isSelected }) => (isSelected ? "#00C8FF" : "none")};
  color: ${({ isSelected }) => (isSelected ? "#fff" : "#454545")};
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  box-sizing: border-box;
  border: ${({ isSelected }) => (isSelected ? "none" : "1px solid #AADFF7")};

  @media (max-width: 1600px) {
    font-size: 1rem;
    padding: 0 1rem;
    min-height: 2.5rem;
  }
`;

const TagLabel = styled.span`
  white-space: nowrap;
`;
