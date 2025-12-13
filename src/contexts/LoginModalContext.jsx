import React, { createContext, useContext, useState, useCallback } from "react";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  PKCE_VERIFIER_KEY,
} from "../utils/pkce";

const LoginModalContext = createContext(null);

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const startGoogleLogin = useCallback(async () => {
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
  }, [isLoading]);

  return (
    <LoginModalContext.Provider
      value={{ isOpen, openLoginModal, closeLoginModal, startGoogleLogin, isLoading }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within a LoginModalProvider");
  }
  return context;
}

