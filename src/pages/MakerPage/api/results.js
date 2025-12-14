// Result 관련 API 함수들 (프롬프트 실행 및 히스토리)
import apiClient from "../../../api/client";

/**
 * 프롬프트를 GPT로 실행하고 History를 생성합니다.
 * @param {number} makerId - 메이커 ID (필수)
 * @param {string} prompt - 실행할 프롬프트 내용 (필수)
 * @returns {Promise<{historyId: number, resultType: string, resultText: string, resultImageUrl: string, createdAt: string}>} 실행 결과 및 히스토리 정보
 */
export const runPrompt = async (makerId, prompt) => {
  if (!makerId) {
    throw new Error("makerId는 필수입니다.");
  }
  if (!prompt) {
    throw new Error("prompt는 필수입니다.");
  }

  const params = new URLSearchParams();
  params.append("prompt", prompt);

  const response = await apiClient.post(
    `/api/makers/${makerId}/histories/run?${params.toString()}`,
    null
  );
  return response.data;
};

/**
 * 메이커의 히스토리 목록을 조회합니다 (최신순).
 * @param {number} makerId - 메이커 ID (필수)
 * @returns {Promise<Array<{historyId: number, title: string}>>} 히스토리 목록
 */
export const getRunHistory = async (makerId) => {
  if (!makerId) {
    throw new Error("makerId는 필수입니다.");
  }

  const response = await apiClient.get(`/api/makers/${makerId}/histories`);
  return response.data;
};

/**
 * 선택한 히스토리로 메이커를 복원합니다.
 * @param {number} makerId - 메이커 ID (필수)
 * @param {number} historyId - 히스토리 ID (필수)
 * @returns {Promise<{historyId: number, snapshotTitle: string, snapshotContent: string, snapshotImages: Array<{imageUrl: string, orderIndex: number}>, resultType: string, resultText: string, resultImageUrl: string, createdAt: string}>} 복원된 메이커 정보 및 결과
 */
export const restoreHistory = async (makerId, historyId) => {
  if (!makerId) {
    throw new Error("makerId는 필수입니다.");
  }
  if (!historyId) {
    throw new Error("historyId는 필수입니다.");
  }

  const response = await apiClient.patch(
    `/api/makers/${makerId}/histories/${historyId}/restore`
  );
  return response.data;
};

/**
 * 현재 프롬프트에 대한 피드백을 조회합니다.
 * @param {number} makerId - 메이커 ID (필수)
 * @returns {Promise<{feedback: string}>} 피드백 문구
 */
export const getPromptFeedback = async (makerId) => {
  if (!makerId) {
    throw new Error("makerId는 필수입니다.");
  }

  const response = await apiClient.post(
    `/api/makers/${makerId}/feedback`,
    null
  );
  return response.data;
};

/**
 * 히스토리 결과 이미지를 다운로드합니다.
 * @param {number} makerId - 메이커 ID (필수)
 * @param {number} historyId - 히스토리 ID (필수)
 * @returns {Promise<Blob>} 이미지 Blob 데이터
 */
export const downloadHistoryImage = async (makerId, historyId) => {
  if (!makerId) {
    throw new Error("makerId는 필수입니다.");
  }
  if (!historyId) {
    throw new Error("historyId는 필수입니다.");
  }

  const response = await apiClient.get(
    `/api/makers/${makerId}/histories/${historyId}/image/download`,
    {
      responseType: "blob", // 이미지 파일을 Blob으로 받기
    }
  );
  return response.data;
};
