import { useState, useRef, useEffect } from "react";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const useImageAttachment = () => {
  const [attachedImages, setAttachedImages] = useState([]);
  const fileInputRef = useRef(null);

  const revokePreviewUrls = (images) => {
    images.forEach((image) => {
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
  };

  const normalizeFiles = (files, currentCount) => {
    if (!Array.isArray(files) || files.length === 0) return [];

    const imageFiles = files.filter((file) => file.type?.startsWith("image/"));
    const availableSlots = Math.max(0, MAX_IMAGES - currentCount);
    if (availableSlots <= 0) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.`);
      return [];
    }

    const validFiles = [];
    const oversizedFiles = [];

    imageFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      alert(
        `각 이미지 파일은 50MB 이하여야 합니다. 제한 초과: ${oversizedFiles.join(
          ", "
        )}`
      );
    }

    return validFiles.slice(0, availableSlots);
  };

  const addImages = (files) => {
    if (!files?.length) return;
    const currentCount = attachedImages.length;
    const normalized = normalizeFiles(files, currentCount);
    if (normalized.length === 0) return;

    const newImages = normalized.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setAttachedImages((prev) => [...prev, ...newImages]);
  };

  const replaceImagesWithFiles = (files) => {
    revokePreviewUrls(attachedImages);
    setAttachedImages([]);
    if (!files?.length) return;
    const normalized = normalizeFiles(files, 0);
    if (normalized.length === 0) return;
    const newImages = normalized.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setAttachedImages(newImages);
  };

  const handleImageRemove = (imageId) => {
    setAttachedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    addImages(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageAttachClick = () => {
    fileInputRef.current?.click();
  };

  const clearImages = ({ keepUrls = false } = {}) => {
    if (!keepUrls) {
      revokePreviewUrls(attachedImages);
    }
    setAttachedImages([]);
  };

  useEffect(() => {
    return () => {
      revokePreviewUrls(attachedImages);
    };
  }, [attachedImages]);

  return {
    attachedImages,
    fileInputRef,
    handleImageAttachClick,
    handleImageSelect,
    handleImageRemove,
    clearImages,
    replaceImagesWithFiles,
    addImagesFromFiles: addImages,
  };
};
