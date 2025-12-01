import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import ImgUploadButtonImg from "../assets/image-upload-button.svg";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function ImageUploader({
  attachedImages = [],
  onAttachedImagesChange,
}) {
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

    const updatedImages = [...attachedImages, ...newImages];
    onAttachedImagesChange?.(updatedImages);
  };

  const handleImageRemove = (imageId) => {
    const imageToRemove = attachedImages.find((img) => img.id === imageId);
    if (imageToRemove && imageToRemove.preview) {
      // 로컬 파일의 preview URL만 정리 (서버 이미지는 preview가 없음)
      URL.revokeObjectURL(imageToRemove.preview);
    }
    const updatedImages = attachedImages.filter((img) => img.id !== imageId);
    onAttachedImagesChange?.(updatedImages);
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

  useEffect(() => {
    return () => {
      // cleanup: 컴포넌트 언마운트 시 preview URL 정리
      if (attachedImages && attachedImages.length > 0) {
        revokePreviewUrls(attachedImages);
      }
    };
  }, [attachedImages]);

  return (
    <UploaderWrapper>
      <Divider />
      <BottomSection>
        <UploadButton onClick={handleImageAttachClick}>
          <UploadButtonImg src={ImgUploadButtonImg} />
        </UploadButton>
        {attachedImages.length > 0 && (
          <ImagesPreviewContainer>
            {attachedImages.map((image) => (
              <ImagePreviewItem key={image.id}>
                <ImagePreviewRemoveButton
                  type="button"
                  aria-label="이미지 제거"
                  onClick={() => handleImageRemove(image.id)}
                >
                  ✕
                </ImagePreviewRemoveButton>
                <ImagePreview
                  src={image.preview || image.imageUrl || image.url}
                  alt="첨부된 이미지"
                />
              </ImagePreviewItem>
            ))}
          </ImagesPreviewContainer>
        )}
      </BottomSection>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
      />
    </UploaderWrapper>
  );
}

const UploaderWrapper = styled.div`
  width: 100%;
  margin-top: 4vh;
  position: relative;
  margin-bottom: 0;
`;

const Divider = styled.div`
  max-width: 80vh;
  height: 0.01vh;
  background-color: #aadff7;
  margin-bottom: 1.5vh;
`;

const BottomSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  max-width: 80vh;
  min-height: 6rem; /* 고정 높이: 이미지 크기와 동일 (6rem = 96px) */
  height: 6rem; /* 고정 높이로 설정하여 이미지 추가해도 크기 변하지 않음 */
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const ImagesPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f5f5f5;
  width: 6rem;
  height: 6rem;
  flex-shrink: 0;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePreviewRemoveButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;

  ${ImagePreviewItem}:hover & {
    opacity: 1;
  }
`;

const UploadButtonImg = styled.img`
  width: 2.875rem;
  height: auto;
`;

const HiddenInput = styled.input`
  display: none;
`;
