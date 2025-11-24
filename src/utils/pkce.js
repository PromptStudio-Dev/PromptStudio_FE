const PKCE_VERIFIER_KEY = "pkce_verifier";

// Generate a high-entropy code_verifier (default 64 chars within PKCE allowed charset)
export function generateCodeVerifier(length = 64) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const cryptoObj = window.crypto || window.msCrypto;

  // Prefer cryptographically secure randomness if available
  if (cryptoObj?.getRandomValues) {
    const randomValues = new Uint32Array(length);
    cryptoObj.getRandomValues(randomValues);
    for (let i = 0; i < length; i += 1) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  }

  // Fallback to Math.random (less secure, but keeps flow functional)
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generateCodeChallenge(codeVerifier) {
  const hashed = await sha256(codeVerifier);
  return base64UrlEncode(hashed);
}

export { PKCE_VERIFIER_KEY };
