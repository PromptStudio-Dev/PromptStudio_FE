import { useState, useRef, useEffect } from "react";

export const useImageAttachment = () => {
  const [attachedImages, setAttachedImages] = useState([]);
  const fileInputRef = useRef(null);

  const addImages = (files) => {
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setAttachedImages((prev) => [...prev, ...newImages]);
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
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (attachedImages.length + imageFiles.length > 6) {
      alert("이미지는 최대 6장까지 첨부할 수 있습니다.");
      const remainingSlots = 6 - attachedImages.length;
      const filesToAdd = imageFiles.slice(0, remainingSlots);
      addImages(filesToAdd);
    } else {
      addImages(imageFiles);
    }

    // input 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageAttachClick = () => {
    fileInputRef.current?.click();
  };

  const clearImages = ({ keepUrls = false } = {}) => {
    if (!keepUrls) {
      attachedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    }
    setAttachedImages([]);
  };

  // 컴포넌트 언마운트 시 이미지 URL 정리
  useEffect(() => {
    return () => {
      attachedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [attachedImages]);

  return {
    attachedImages,
    fileInputRef,
    handleImageAttachClick,
    handleImageSelect,
    handleImageRemove,
    clearImages,
  };
};
