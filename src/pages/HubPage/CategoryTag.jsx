import React from "react";
import styled from "styled-components";

export default function CategoryTag({
  img = "",
  isSelected = false,
  name = "default",
  onClick,
}) {
  const hasIcon = Boolean(img);

  return (
    <Tag isSelected={isSelected} onClick={onClick}>
      {hasIcon && (
        <ImageContainer isSelected={isSelected}>
          <IconImage src={img} alt={name} isSelected={isSelected} />
        </ImageContainer>
      )}
      <TagLabel>{name}</TagLabel>
    </Tag>
  );
}

const IconImage = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
  object-fit: contain;
  display: block;
  filter: brightness(0) saturate(100%) invert(69%) sepia(93%) saturate(1352%)
    hue-rotate(156deg) brightness(101%) contrast(101%);
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.8125rem;
  height: 1.8125rem;
  margin-right: 0.5rem;
  border-radius: 50%;
  background: #fff;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.34rem 0.62rem;
  min-width: 4rem;
  min-height: 2.4925rem;
  border-radius: 7.5rem;
  background: ${({ isSelected }) => (isSelected ? "#00C8FF" : "#EBFAFF")};
  color: ${({ isSelected }) => (isSelected ? "#fff" : "#6ED1FF")};
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  box-sizing: border-box;

  @media (max-width: 1600px) {
    font-size: 1rem;
    padding: 0.34rem 0.62rem;
    min-height: 2.4925rem;
  }
`;

const TagLabel = styled.span`
  white-space: nowrap;
`;
