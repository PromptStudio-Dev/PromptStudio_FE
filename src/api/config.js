// API 설정
export const API_CONFIG = {
  // 환경 변수가 있으면 사용하고, 없으면 기본값 사용
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 60000, // 60초
  // 개발 모드 확인
  IS_DEV: import.meta.env.DEV,
};
