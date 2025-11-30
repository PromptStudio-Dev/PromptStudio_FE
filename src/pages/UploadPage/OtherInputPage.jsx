import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

export default function OtherInputPage({
  formData,
  setFormData,
  setImageFile,
  onRemoveImage,
}) {
  const [selectedAi, setSelectedAi] = useState(
    formData.aiEnvironment || "Chat GPT"
  );
  const [imagePreview, setImagePreview] = useState(
    formData.existingImageUrl || null
  );
  const [selectedResultType, setSelectedResultType] = useState(
    formData.resultType || "image"
  );
  const fileInputRef = useRef(null);

  const aiOptions = [
    "Chat GPT",
    "Gemini",
    "Perplexity",
    "DALL-E",
    "Midjourney",
    "v0",
    "기타",
  ];

  const handleAiChange = (e) => {
    const ai = e.target.value;
    setSelectedAi(ai);
    setFormData((prev) => ({ ...prev, aiEnvironment: ai }));
  };

  const handleResultTypeChange = (type) => {
    setSelectedResultType(type);
    setFormData((prev) => ({ ...prev, resultType: type }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 제한 (예: 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }

    setImageFile(file);
    setImagePreview(null); // 새 파일 기준으로 프리뷰 갱신

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (e) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 방지
    setImageFile(null);
    setImagePreview(null);
    onRemoveImage?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResultTextChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, result: value }));
  };

  useEffect(() => {
    setSelectedResultType(formData.resultType || "image");
  }, [formData.resultType]);

  useEffect(() => {
    if (formData.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(formData.file);
      return;
    }

    if (!formData.file && formData.existingImageUrl) {
      setImagePreview(formData.existingImageUrl);
      return;
    }

    if (!formData.file && !formData.existingImageUrl) {
      setImagePreview(null);
    }
  }, [formData.file, formData.existingImageUrl]);

  return (
    <OtherInputPageWrapper>
      <AiNameSection>
        <TitleText>사용한 (추천하는) AI </TitleText>
        <AiSelectSection>
          {aiOptions.map((ai) => (
            <RadioOption key={ai} onClick={() => setSelectedAi(ai)}>
              <RadioInput
                type="radio"
                id={ai}
                name="ai-selection"
                value={ai}
                checked={selectedAi === ai}
                onChange={handleAiChange}
              />
              <CustomRadioButton $isChecked={selectedAi === ai} />
              <RadioLabel htmlFor={ai}>{ai}</RadioLabel>
            </RadioOption>
          ))}
        </AiSelectSection>
      </AiNameSection>
      <BottomSection>
        <ResultInputSection>
          <ResultHeader>
            <TitleText>결과 등록</TitleText>
            <ResultToggleButton
              type="button"
              $isTextSelected={selectedResultType === "text"}
              onClick={() =>
                handleResultTypeChange(
                  selectedResultType === "image" ? "text" : "image"
                )
              }
            >
              <ResultToggleLabel $isActive={selectedResultType === "image"}>
                이미지
              </ResultToggleLabel>
              <ResultToggleLabel $isActive={selectedResultType === "text"}>
                텍스트
              </ResultToggleLabel>
            </ResultToggleButton>
          </ResultHeader>
          <ResultGuideText>
            {selectedResultType === "image"
              ? "결과 이미지를 올리면 프롬프트의 매력이 더 잘 전달돼요. 특히 이미지 프롬프트의 경우 사용자들의 관심을 끌 수 있어요."
              : "프롬프트 실행 결과를 텍스트로 소개하면 사용자들이 더욱 쉽게 이해할 수 있어요."}
          </ResultGuideText>
          {selectedResultType === "image" ? (
            <ImageUploadBox onClick={handleImageClick}>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <ImagePreviewContainer>
                  <ImagePreview src={imagePreview} alt="미리보기" />
                  <RemoveImageButton onClick={handleImageRemove}>
                    ×
                  </RemoveImageButton>
                </ImagePreviewContainer>
              ) : (
                <PlusIcon>+</PlusIcon>
              )}
            </ImageUploadBox>
          ) : (
            <ResultTextAreaWrapper>
              <ResultTextArea
                value={formData.result || ""}
                onChange={handleResultTextChange}
                placeholder="결과 텍스트를 입력해주세요."
              />
            </ResultTextAreaWrapper>
          )}
        </ResultInputSection>
      </BottomSection>
    </OtherInputPageWrapper>
  );
}

const BottomSection = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  margin-top: 3.13rem;
`;

const ResultInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 1rem;
`;

const ResultHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ResultToggleButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 12rem;
  height: 2.5rem;
  border-radius: 7.5rem;
  border: 0.0625rem solid var(--Light-blue, #49d8ff);
  background: #fff;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
  overflow: hidden;
  margin-top: 0.2rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: ${({ $isTextSelected }) => ($isTextSelected ? "50%" : "0")};
    width: 50%;
    height: 100%;
    background: #00c8ff;
    border-radius: inherit;
    transition: left 0.2s ease;
  }
`;

const ResultToggleLabel = styled.span`
  flex: 1;
  text-align: center;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#6ed1ff")};
  z-index: 1;
  transition: color 0.2s ease;
`;

const AiSelectSection = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
  margin-top: 1.5rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;

  &:has(input:checked) label {
    color: var(--B-Blue-line, #00aeff);
  }
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CustomRadioButton = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.125rem solid
    ${({ $isChecked }) => ($isChecked ? "#00aeff" : "#D9D9D9")};
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: "";
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background-color: ${({ $isChecked }) =>
      $isChecked ? "#00aeff" : "#D9D9D9"};
    transition: background-color 0.2s ease;
  }
`;

const RadioLabel = styled.label`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`;

const AiNameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
`;

const OtherInputPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleText = styled.span`
  color: var(--B-Blue-line, #00aeff);
  text-align: center;
  font-family: Pretendard;
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.01625rem;
`;

const ResultGuideText = styled.span`
  color: var(--B-T, #454545);
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-top: 0.5rem;
  line-height: 120%;
  letter-spacing: -0.02rem;
`;

const ResultTextAreaWrapper = styled.div`
  width: 100%;
  min-height: 12rem;
  border-radius: 1rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
  padding: 1.5rem 2rem;
  background: #fff;
`;

const ResultTextArea = styled.textarea`
  width: 100%;
  min-height: 9rem;
  border: none;
  resize: none;
  outline: none;
  font-family: Pretendard;
  font-size: 1.25rem;
  color: #454545;
  line-height: 1.5;

  &::placeholder {
    color: #d9d9d9;
  }
`;

const ImageUploadBox = styled.div`
  width: 9.375rem;
  height: 9.375rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #f9f9f9;
    border-color: var(--B-Blue-line, #00aeff);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  line-height: 1;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const PlusIcon = styled.span`
  color: var(--Light-blue, #49d8ff);
  font-size: 3rem;
  font-weight: 300;
  line-height: 1;
  user-select: none;
`;
