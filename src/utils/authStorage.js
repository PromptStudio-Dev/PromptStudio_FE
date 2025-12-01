const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const MEMBER_ID_KEY = "memberId";

export const storeAuthData = ({
  accessToken,
  refreshToken,
  memberId,
} = {}) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (memberId) {
    localStorage.setItem(MEMBER_ID_KEY, memberId);
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(MEMBER_ID_KEY);
};

export const getMemberId = () => localStorage.getItem(MEMBER_ID_KEY);

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const isLoggedIn = () => Boolean(getAccessToken());
