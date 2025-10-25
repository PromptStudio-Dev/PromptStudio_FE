import React from "react";
import styled from "styled-components";
import SearchButtonImg from "../../../assets/icon/search-icon.png";

// 조립된 검색창 컴포넌트
export default function SearchInput() {
  return (
    <SearchContainer>
      <SearchButton>
        <SearchButtonIcon src={SearchButtonImg} />
      </SearchButton>
      <StyledInput />
    </SearchContainer>
  );
}

// 1. 전체를 감싸는 div (여기 에 모든 겉모양 스타일을 적용)
const SearchContainer = styled.div`
  width: 8.7vw;
  height: 4.8vh;
  background-color: #ffffff;
  border-radius: 999px; /* 매우 큰 값을 주어 완벽한 캡슐 형태로 만듭니다 */
  padding: 0.25rem 0.8125rem;
  display: flex;
  align-items: center;
`;

// 2. 텍스트 입력 input (테두리, 배경 등은 모두 제거)
const StyledInput = styled.input`
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  font-size: 1.4375rem;

  &::placeholder {
    color: #aaa;
  }
`;

// 3. 검색 아이콘 button
const SearchButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  font-size: 1.4375rem;
`;

const SearchButtonIcon = styled.img`
  width: 2.3vh;
  margin-top: 0.5vh;
  margin-right: 1vh;
`;
