import axios from "axios";
import { API_CONFIG } from "./config";
import { storeAuthData, clearAuthData, getRefreshToken } from "../utils/authStorage";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise = null;
const refreshQueue = [];

const enqueueRequest = (callback) => {
  refreshQueue.push(callback);
};

const resolveQueue = (token) => {
  refreshQueue.splice(0, refreshQueue.length).forEach((cb) => cb(token));
};

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
    const originalRequest = error.config;

    // 401 처리 및 토큰 재발급
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/api/auth/reissue")
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth-changed"));
        return Promise.reject(error);
      }

      // 이미 갱신 중이면 큐에 등록해서 완료 후 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          enqueueRequest((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      refreshPromise = axios
        .post(
          `${API_CONFIG.BASE_URL}/api/auth/reissue`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          const { accessToken, refreshToken: newRefreshToken, memberId } =
            res.data || {};
          storeAuthData({
            accessToken,
            refreshToken: newRefreshToken,
            memberId,
          });
          window.dispatchEvent(new Event("auth-changed"));
          resolveQueue(accessToken);
          return accessToken;
        })
        .catch((refreshError) => {
          console.error("토큰 재발급 실패:", refreshError);
          clearAuthData();
          window.dispatchEvent(new Event("auth-changed"));
          resolveQueue(null);
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });

      return refreshPromise.then((newToken) => {
        if (!newToken) {
          return Promise.reject(error);
        }
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      });
    }

    // 기타 에러 처리
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error("권한이 없습니다.");
          break;
        case 404:
          console.error("요청한 리소스를 찾을 수 없습니다.");
          break;
        case 500:
          console.error("서버 오류가 발생했습니다.");
          break;
        default:
          console.error("에러가 발생했습니다:", error.response.data);
      }
    } else if (error.request) {
      console.error("서버로부터 응답을 받지 못했습니다.");
    } else {
      console.error("요청 설정 중 오류가 발생했습니다:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
