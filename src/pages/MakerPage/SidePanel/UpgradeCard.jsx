import React from "react";
import styled from "styled-components";
import UpgradeMenu from "../shared/UpgradeMenu";

function UpgradeCard({ title, content, isApplied }) {
  return (
    <CardWrapper>
      <CardTitle $isApplied={isApplied}>{title}</CardTitle>
      <CardContentWrapper $isApplied={isApplied}>
        <CardContent>{content}</CardContent>
      </CardContentWrapper>
    </CardWrapper>
  );
}

export default UpgradeCard;

// Styled Components
const CardWrapper = styled.div`
  width: 100%;
  margin-bottom: 16px;
  position: relative;
`;

const CardTitle = styled.p`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 23px;
  font-weight: 600;
  line-height: normal;
  color: ${(props) => (props.$isApplied ? "#00aeff" : "#000000")};
  margin: 0 0 16px 0;
`;

const CardContentWrapper = styled.div`
  width: 100%;
  height: 167px;
  background-color: ${(props) => (props.$isApplied ? "#001e40" : "#e0f5ff")};
  border-radius: 16px;
  padding: 26px 21px;
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const CardContent = styled.div`
  width: 100%;
  height: 115px;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 23px;
  font-weight: 400;
  line-height: normal;
  color: ${(props) => (props.$isApplied ? "#ffffff" : "#000000")};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;
