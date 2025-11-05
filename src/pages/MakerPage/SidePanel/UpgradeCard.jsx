import React from "react";
import styled from "styled-components";

export default function UpgradeCard({ title, content, isApplied }) {
  return (
    <CardWrapper>
      <CardTitle $isApplied={isApplied}>{title}</CardTitle>
      <CardContentWrapper $isApplied={isApplied}>
        <CardContent>{content}</CardContent>
      </CardContentWrapper>
    </CardWrapper>
  );
}

// Styled Components
const CardWrapper = styled.div`
  width: 18.91vw; /* 363px @ 1920px */
  margin-bottom: 1rem; /* 16px */
  position: relative;
`;

const CardTitle = styled.p`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4375rem; /* 23px */
  font-weight: 600;
  line-height: normal;
  color: ${(props) => (props.$isApplied ? "#00aeff" : "#000000")};
  margin: 0 0 1rem 0; /* 16px */
`;

const CardContentWrapper = styled.div`
  width: 100%;
  height: 15.46vh; /* 167px @ 1080px */
  background-color: ${(props) => (props.$isApplied ? "#001e40" : "#e0f5ff")};
  border-radius: 0.83vw; /* 16px @ 1920px */
  padding: 2.41vh 1.09vw; /* 26px 21px @ 1920x1080 */
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const CardContent = styled.div`
  width: 16.72vw; /* 321px @ 1920px */
  height: 10.65vh; /* 115px @ 1080px */
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.4375rem; /* 23px */
  font-weight: 400;
  line-height: normal;
  color: ${(props) => (props.$isApplied ? "#ffffff" : "#000000")};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;
