// Maker 관련 API 함수들
import apiClient from "../../../api/client";

/**
 * 새로운 메이커를 생성
 * @returns {Promise<{makerId: number}>} 생성된 메이커의 ID
 */
export const createMaker = async () => {
  const response = await apiClient.post(`/api/makers`);
  return response.data;
};

/**
 * 메이커의 상세 정보 조회
 * @param {number} makerId - 메이커 ID
 * @returns {Promise<{makerId: number, title: string, content: string, images: Array<{imageId: number, imageUrl: string, orderIndex: number}>, createdAt: string, updatedAt: string}>} 메이커 상세 정보
 */
export const getMaker = async (makerId) => {
  const response = await apiClient.get(`/api/makers/${makerId}`);
  return response.data;
};

/**
 * 메이커 삭제
 * 메이커와 연관된 모든 데이터를 삭제합니다.
 *
 * @param {number} makerId - 메이커 ID (필수)
 * @returns {Promise<any>} 서버 응답 데이터
 */
export const deleteMaker = async (makerId) => {
  if (!makerId) {
    throw new Error("makerId는 필수입니다.");
  }

  const response = await apiClient.delete(`/api/makers/${makerId}`);
  return response.data;
};

/**
 * 메이커 전체 목록 조회
 * RUN / NO RUN 여부에 따라 hasHistory(boolean)으로 구분합니다.
 *
 * @param {Object} params - 조회 파라미터
 * @param {boolean} params.hasHistory - true: RUN, false: NO RUN
 * @param {number} [params.page=0] - 페이지 번호(0부터 시작)
 * @param {number} [params.size=9] - 페이지 크기 (기본 9개)
 * @returns {Promise<{
 *   makers: Array<{
 *     makerId: number,
 *     title: string,
 *     resultType: string,
 *     resultText: string,
 *     resultImageUrl: string,
 *     content: string,
 *     updatedAt: string
 *   }>,
 *   currentPage: number,
 *   totalPages: number,
 *   totalElements: number,
 *   hasNext: boolean
 * }>}
 */
export const getMakers = async ({ hasHistory, page = 0, size = 9 }) => {
  const response = await apiClient.get(`/api/makers`, {
    params: {
      hasHistory,
      page,
      size,
    },
  });

  return response.data;
};

/**
 * 메이커 자동 저장 (2초 debounce).
 * @param {number} makerId - 메이커 ID (필수)
 * @param {Object} data - 저장할 메이커 데이터
 * @param {string} data.title - 메이커 제목 (optional)
 * @param {string} data.content - 메이커 내용 (optional)
 * @param {Array<string>} data.existingImageUrls - 유지할 기존 이미지 URL 배열 (optional)
 * @param {Array<File>} data.newImages - 새로 추가할 이미지 파일 배열 (optional)
 * @returns {Promise<Object>} 저장된 메이커 정보 {makerId, title, updatedAt}
 */
export const autoSaveMaker = async (makerId, data) => {
  if (!makerId) {
    throw new Error("makerId는 필수입니다.");
  }

  // FormData 구성: 긴 텍스트는 바디로 보내 URL 길이/쿼리 제한을 피함
  const formData = new FormData();

  if (data.title !== undefined && data.title !== null) {
    formData.append("title", data.title);
  }
  if (data.content !== undefined && data.content !== null) {
    formData.append("content", data.content);
  }
  if (data.existingImageUrls && Array.isArray(data.existingImageUrls)) {
    data.existingImageUrls.forEach((url) => {
      formData.append("existingImageUrls", url);
    });
  }

  if (data.newImages && Array.isArray(data.newImages)) {
    data.newImages.forEach((file) => {
      if (file instanceof File) {
        formData.append("newImages", file);
      }
    });
  }

  const response = await apiClient.patch(`/api/makers/${makerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * 텍스트 업그레이드 (GPT로 선택한 텍스트를 업그레이드)
 * @param {Object} data - 업그레이드 요청 데이터
 * @param {string} data.fullText - 전체 텍스트
 * @param {string} data.selectedText - 선택한 텍스트
 * @param {string} data.direction - 업그레이드 방향 (예: "더 간결하게", "더 자세하게" 등)
 * @returns {Promise<{originalText: string, upgradedText: string, direction: string}>} 업그레이드된 텍스트 정보
 */
export const upgradeMakerText = async (data) => {
  if (!data.fullText || !data.selectedText) {
    throw new Error("fullText, selectedText는 필수입니다.");
  }

  // null이나 undefined를 빈 문자열로 변환 (백엔드에서 null을 받지 않음)
  const direction = data.direction ?? "";

  const response = await apiClient.post(`/api/makers/upgrade`, {
    fullText: data.fullText,
    selectedText: data.selectedText,
    direction: direction,
  });

  return response.data;
};

/**
 * 텍스트 재업그레이드 (GPT로 선택한 텍스트를 재업그레이드)
 * @param {Object} data - 재업그레이드 요청 데이터
 * @param {string} data.fullText - 전체 텍스트
 * @param {string} data.selectedText - 선택한 텍스트
 * @param {string} data.prevDirection - 이전 업그레이드 방향
 * @param {string} data.prevResult - 이전 업그레이드 결과
 * @param {string} data.direction - 새로운 업그레이드 방향
 * @returns {Promise<{originalText: string, upgradedText: string, direction: string}>} 재업그레이드된 텍스트 정보
 */
export const reupgradeMakerText = async (data) => {
  // fullText와 selectedText는 빈 문자열이면 안 됨 (실제 텍스트 필요)
  if (!data.fullText || !data.selectedText) {
    throw new Error("fullText, selectedText는 필수입니다.");
  }

  // null이나 undefined를 빈 문자열로 변환 (백엔드에서 null을 받지 않음)
  const prevDirection = data.prevDirection ?? "";
  const direction = data.direction ?? "";

  const response = await apiClient.post(`/api/makers/reupgrade`, {
    fullText: data.fullText,
    selectedText: data.selectedText,
    prevDirection: prevDirection,
    prevResult: data.prevResult,
    direction: direction,
  });

  return response.data;
};
