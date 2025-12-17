import { useState, useRef, useEffect, useCallback } from "react";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const useImageAttachment = ({
  onMaxImagesExceeded,
  onFileSizeExceeded,
} = {}) => {
  const [attachedImages, setAttachedImages] = useState([]);
  const fileInputRef = useRef(null);
  const onMaxImagesExceededRef = useRef(onMaxImagesExceeded);
  const onFileSizeExceededRef = useRef(onFileSizeExceeded);

  // 콜백 ref 업데이트
  useEffect(() => {
    onMaxImagesExceededRef.current = onMaxImagesExceeded;
    onFileSizeExceededRef.current = onFileSizeExceeded;
  }, [onMaxImagesExceeded, onFileSizeExceeded]);

  // 언마운트 시 정리를 위해 현재 이미지 리스트를 ref로 추적
  const imagesRef = useRef(attachedImages);

  useEffect(() => {
    imagesRef.current = attachedImages;
  }, [attachedImages]);

  const revokePreviewUrls = useCallback((images) => {
    images.forEach((image) => {
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
  }, []);

  const normalizeFiles = useCallback((files, currentCount) => {
    if (!Array.isArray(files) || files.length === 0) return [];

    const imageFiles = files.filter((file) => file.type?.startsWith("image/"));
    const availableSlots = Math.max(0, MAX_IMAGES - currentCount);
    if (availableSlots <= 0) {
      if (onMaxImagesExceededRef.current) {
        onMaxImagesExceededRef.current();
      }
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
      if (onFileSizeExceededRef.current) {
        onFileSizeExceededRef.current();
      }
    }

    return validFiles.slice(0, availableSlots);
  }, []);

  const addImages = useCallback(
    (files) => {
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
    },
    [attachedImages.length, normalizeFiles]
  );

  const replaceImagesWithFiles = useCallback(
    (files) => {
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
    },
    [attachedImages, normalizeFiles, revokePreviewUrls]
  );

  const handleImageRemove = useCallback((imageId) => {
    setAttachedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  }, []);

  const handleImageSelect = useCallback(
    (event) => {
      const files = Array.from(event.target.files || []);
      addImages(files);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addImages]
  );

  const handleImageAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearImages = useCallback(
    ({ keepUrls = false } = {}) => {
      if (!keepUrls) {
        revokePreviewUrls(attachedImages);
      }
      setAttachedImages([]);
    },
    [attachedImages, revokePreviewUrls]
  );

  useEffect(() => {
    return () => {
      revokePreviewUrls(imagesRef.current);
    };
  }, []);

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
