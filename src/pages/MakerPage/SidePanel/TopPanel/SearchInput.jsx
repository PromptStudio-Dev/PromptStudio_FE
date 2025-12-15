import React from "react";
import styled from "styled-components";
import SearchButtonImg from "../../assets/search-icon.svg";

// 조립된 검색창 컴포넌트
export default function SearchInput({
  value = "",
  onChange,
  onSearch,
  placeholder = "검색어를 입력하세요",
  width,
  disabled = false,
}) {
  const handleInputChange = (event) => {
    if (disabled) return;
    onChange?.(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.();
    }
  };

  const handleSearchClick = () => {
    if (disabled) return;
    onSearch?.();
  };
  return (
    <SearchContainer $width={width} $disabled={disabled}>
      <SearchButton onClick={handleSearchClick} disabled={disabled}>
        <SearchButtonIcon src={SearchButtonImg} />
      </SearchButton>
      <StyledInput
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
    </SearchContainer>
  );
}

// 1. 전체를 감싸는 div (여기 에 모든 겉모양 스타일을 적용)
const SearchContainer = styled.div`
  width: ${(props) => props.$width ?? "21.875rem"}; /* 350px @ 1920px */
  height: 3.0625rem;
  background-color: ${(props) => (props.$disabled ? "#f5f5f5" : "#ffffff")};
  border: 0.0625rem solid
    ${(props) => (props.$disabled ? "#e0e0e0" : "#aadff7")};
  border-radius: 120px;
  padding: 0.25rem 0.8125rem; /* 4px 13px */
  display: flex;
  align-items: center;
  gap: 0.625rem; /* 10px */
  flex-shrink: 0;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.$disabled ? "none" : "auto")};
`;

// 2. 텍스트 입력 input (테두리, 배경 등은 모두 제거)
const StyledInput = styled.input`
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  font-size: 1.1875rem; /* 23px @ 1920px */
  font-family: "Pretendard Variable", sans-serif;
  font-weight: 500;
  color: #454545;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};

  &::placeholder {
    color: #aadff7;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

// 3. 검색 아이콘 button
const SearchButton = styled.button`
  border: none;
  background: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;

const SearchButtonIcon = styled.img`
  width: 1.5rem; /* 36px @ 1920px */
  height: auto;
`;
