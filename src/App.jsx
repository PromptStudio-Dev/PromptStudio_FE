import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import styled from "styled-components";
import {
  LoginModalProvider,
  useLoginModal,
} from "./contexts/LoginModalContext";
import { CopyModalProvider, useCopyModal } from "./contexts/CopyModalContext";
import LoginRequiredModal from "./components/LoginRequiredModal/LoginRequiredModal";
import CopyCompleteModal from "./components/CopyCompleteModal/CopyCompleteModal";

function AppContent() {
  const { isOpen, closeLoginModal, startGoogleLogin } = useLoginModal();
  const { isOpen: isCopyModalOpen, message: copyMessage } = useCopyModal();

  return (
    <Wrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <LoginRequiredModal
        isOpen={isOpen}
        onClose={closeLoginModal}
        onLogin={startGoogleLogin}
      />
      <CopyCompleteModal isOpen={isCopyModalOpen} message={copyMessage} />
    </Wrapper>
  );
}

export default function App() {
  return (
    <LoginModalProvider>
      <CopyModalProvider>
        <AppContent />
      </CopyModalProvider>
    </LoginModalProvider>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1; /* 남은 공간 모두 차지 */
  overflow: hidden;
`;
