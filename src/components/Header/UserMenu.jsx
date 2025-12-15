import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  PKCE_VERIFIER_KEY,
} from "../../utils/pkce";
import { clearAuthData } from "../../utils/authStorage";

export default function UserMenu() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuthChanged = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };
    window.addEventListener("auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  const startGoogleLogin = async () => {
    if (isLoading) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("Google OAuth env vars are missing.");
      return;
    }

    try {
      setIsLoading(true);
      const codeVerifier = generateCodeVerifier();
      sessionStorage.setItem(PKCE_VERIFIER_KEY, codeVerifier);

      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const scope = "openid email profile";

      const authUrl =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&code_challenge=${encodeURIComponent(codeChallenge)}` +
        `&code_challenge_method=S256`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to start Google login:", error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    sessionStorage.removeItem(PKCE_VERIFIER_KEY);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  return (
    <LogoutButton
      onClick={isLoggedIn ? handleLogout : startGoogleLogin}
      disabled={isLoading}
    >
      {isLoggedIn ? "로그아웃" : "로그인"}
    </LogoutButton>
  );
}

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.26vw;
  height: 3.98148148vh;
  padding: 0.62rem 1rem;
  border-radius: 7.5rem;
  border: none;
  background: transparent;
  font-family: "Pretendard", sans-serif;
  font-size: 0.99vw;
  font-weight: 600;
  color: #00aeff;
  border-radius: 7.5rem;
  background: #e6f2ff;
  cursor: pointer;
  transition: background-color 0.15s ease;
`;
