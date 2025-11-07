import axios from "axios";
import { API_CONFIG } from "./config";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (요청 전 처리)
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData인 경우 Content-Type 헤더를 제거 (브라우저가 자동으로 multipart/form-data 설정)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Accept 헤더 추가 (서버가 JSON을 기대할 수 있음)
    config.headers.Accept = "application/json";

    // 디버깅: 실제 요청 URL 확인
    const fullUrl = `${config.baseURL}${config.url}`;
    const params = new URLSearchParams(config.params).toString();
    const finalUrl = params ? `${fullUrl}?${params}` : fullUrl;
    console.log("API 요청 URL:", finalUrl);
    console.log("요청 메서드:", config.method?.toUpperCase());
    console.log("요청 헤더:", config.headers);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 후 처리)
apiClient.interceptors.response.use(
  (response) => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      switch (error.response.status) {
        case 401:
          // 인증 오류 - 로그인 페이지로 리다이렉트
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // 권한 오류
          console.error("권한이 없습니다.");
          break;
        case 404:
          // 리소스를 찾을 수 없음
          console.error("요청한 리소스를 찾을 수 없습니다.");
          break;
        case 500:
          // 서버 오류
          console.error("서버 오류가 발생했습니다.");
          break;
        default:
          console.error("에러가 발생했습니다:", error.response.data);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error("서버로부터 응답을 받지 못했습니다.");
    } else {
      // 요청 설정 중 오류 발생
      console.error("요청 설정 중 오류가 발생했습니다:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
