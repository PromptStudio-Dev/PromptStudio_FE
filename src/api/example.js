// API 사용 예시 파일
// 실제 API 함수들은 이 파일을 참고하여 작성하세요

import apiClient from "./client";

// GET 요청 예시
export const getExample = async (id) => {
  try {
    const response = await apiClient.get(`/api/example/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST 요청 예시
export const createExample = async (data) => {
  try {
    const response = await apiClient.post("/api/example", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT 요청 예시
export const updateExample = async (id, data) => {
  try {
    const response = await apiClient.put(`/api/example/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE 요청 예시
export const deleteExample = async (id) => {
  try {
    const response = await apiClient.delete(`/api/example/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// FormData를 사용한 파일 업로드 예시
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
