import React, { useState } from "react";
import styled from "styled-components";

export default function UserMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(!isLoggedIn);
    // 실제 로그아웃 로직을 여기에 추가
  };

  return (
    <LogoutButton onClick={handleLogout}>
      {isLoggedIn ? "로그아웃" : "로그인"}
    </LogoutButton>
  );
}

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 3.5rem;
  padding: 0.5rem 1rem;
  border-radius: 7.5rem;
  border: none;
  background: transparent;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.625rem;
  font-weight: 600;
  color: #00aeff;
  cursor: pointer;
  transition: background-color 0.15s ease;
`;
