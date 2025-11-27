// Prompt 관련 API 함수들 (MakerPage 전용)
import apiClient from "../../../api/client";

/**
 * 최근 조회한 프롬프트를 조회합니다.
 * @param {number} memberId - 멤버 ID
 * @returns {Promise<Array>} 최근 조회한 프롬프트 목록
 */
export const getRecentPrompts = async () => {
  const response = await apiClient.get(`/api/prompts/recent`);
  return response.data;
};

/**
 * 인기 프롬프트를 조회합니다.
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.memberId - 멤버 ID (선택)
 * @param {string} params.category - 카테고리 (선택)
 * @returns {Promise<Array>} 인기 프롬프트 목록
 */
export const getHotPrompts = async (params = {}) => {
  const response = await apiClient.get("/api/prompts/hot", { params });
  return response.data;
};

/**
 * 전체 프롬프트를 조회합니다.
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.memberId - 멤버 ID (선택)
 * @param {string} params.category - 카테고리 (선택)
 * @returns {Promise<Array>} 프롬프트 목록
 */
export const getAllPrompts = async (params = {}) => {
  const response = await apiClient.get("/api/prompts", { params });
  return response.data;
};

/**
 * 프롬프트를 검색합니다.
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.memberId - 멤버 ID (선택)
 * @param {string} params.category - 카테고리 (선택)
 * @param {string} params.q - 검색어
 * @param {string} params.query - 검색어 (q와 동일)
 * @returns {Promise<Array>} 검색 결과 프롬프트 목록
 */
export const searchPrompts = async (params) => {
  const response = await apiClient.get("/api/prompts/search", { params });
  return response.data;
};

/**
 * 프롬프트 상세 정보를 조회합니다.
 * @param {number} promptId - 프롬프트 ID
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.memberId - 멤버 ID (선택)
 * @returns {Promise<Object>} 프롬프트 상세 정보
 */
export const getPromptDetail = async (promptId, params = {}) => {
  const response = await apiClient.get(`/api/prompts/${promptId}`, { params });
  return response.data;
};
