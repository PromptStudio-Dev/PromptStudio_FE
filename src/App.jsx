import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import styled from "styled-components";

export default function App() {
  return (
    <Wrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1; /* 남은 공간 모두 차지 */
  overflow: hidden;
`;
