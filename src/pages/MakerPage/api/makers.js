// Maker 관련 API 함수들
import apiClient from "../../../api/client";

/**
 * 새로운 메이커를 생성합니다.
 * @param {number} memberId - 멤버 ID
 * @returns {Promise<{makerId: number}>} 생성된 메이커의 ID
 */
export const createMaker = async (memberId) => {
  const response = await apiClient.post(`/api/makers/members/${memberId}`);
  return response.data;
};

/**
 * 메이커의 상세 정보를 조회합니다.
 * @param {number} makerId - 메이커 ID
 * @returns {Promise<{makerId: number, title: string, content: string, images: Array<{imageId: number, imageUrl: string, orderIndex: number}>, createdAt: string, updatedAt: string}>} 메이커 상세 정보
 */
export const getMaker = async (makerId) => {
  const response = await apiClient.get(`/api/makers/${makerId}`);
  return response.data;
};
