import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import { PKCE_VERIFIER_KEY } from "../../utils/pkce";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("로그인 처리 중입니다...");

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (!code) {
        setMessage("로그인에 실패했습니다. code 파라미터가 없습니다.");
        return;
      }

      const codeVerifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
      if (!codeVerifier) {
        setMessage("로그인 세션 정보가 없습니다. 다시 시도해주세요.");
        return;
      }

      const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
      if (!redirectUri) {
        setMessage("환경 변수를 확인해주세요. redirect URI가 설정되지 않았습니다.");
        return;
      }

      try {
        setMessage("구글 로그인 정보를 확인하는 중입니다...");
        const { data } = await apiClient.post("/api/auth/google", {
          code,
          redirectUri,
          codeVerifier,
        });

        const { accessToken, refreshToken, memberId } = data || {};

        if (accessToken) {
          localStorage.setItem("token", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        if (memberId) {
          localStorage.setItem("memberId", memberId);
        }

        sessionStorage.removeItem(PKCE_VERIFIER_KEY);
        window.dispatchEvent(new Event("auth-changed"));
        setMessage("로그인에 성공했습니다. 잠시 후 이동합니다.");
        navigate("/", { replace: true });
      } catch (error) {
        console.error("구글 로그인 처리 중 오류:", error);
        setMessage("로그인 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    };

    handleAuth();
  }, [location.search, navigate]);

  return <StatusMessage>{message}</StatusMessage>;
}

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  color: #333;
  text-align: center;
  padding: 2rem;
`;
