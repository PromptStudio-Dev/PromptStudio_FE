import React, { useRef } from "react";
import styled from "styled-components";
import ImgUploadButtonImg from "../assets/image-upload-button.svg";

export default function ImageUploader() {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 이미지 처리 로직
      console.log("Selected files:", files);
    }
  };

  return (
    <UploaderWrapper>
      <Divider />
      <UploadButton onClick={handleClick}>
        <UploadButtonImg src={ImgUploadButtonImg} />
      </UploadButton>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </UploaderWrapper>
  );
}

const UploaderWrapper = styled.div`
  width: 100%;
  margin-top: 4vh;
  position: relative;
  margin-bottom: 10vh;
`;

const Divider = styled.div`
  max-width: 80vh;
  height: 0.01vh;
  background-color: #aadff7;
  margin-bottom: 1.5vh;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const UploadButtonImg = styled.img`
  width: 100%;
`;

const HiddenInput = styled.input`
  display: none;
`;
