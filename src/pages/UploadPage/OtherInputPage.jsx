import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import CategoryTag from "../HubPage/CategoryTag";
import businessIcon from "../HubPage/assets/businessIcon.svg";
import employeeIcon from "../HubPage/assets/employeeIcon.svg";
import investIcon from "../HubPage/assets/investIcon.svg";
import designIcon from "../HubPage/assets/designIcon.svg";
import normalIcon from "../HubPage/assets/normalIcon.svg";
import studyIcon from "../HubPage/assets/studyIcon.svg";
import lockIcon from "./assets/lockIcon.svg";
import unlockIcon from "./assets/unlockIcon.svg";
import NextButtonIconImage from "./assets/nextButtonIcon.svg";
import apiClient from "../../api/client";

export default function OtherInputPage({ onPrev, formData, setFormData }) {
  const [selectedAi, setSelectedAi] = useState(
    formData.aiEnvironment || "Chat GPT"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    formData.category || ""
  );
  const [selectedScope, setSelectedScope] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const categories = [
    { name: "비즈니스", img: businessIcon },
    { name: "취업", img: employeeIcon },
    { name: "개발", img: investIcon },
    { name: "디자인", img: designIcon },
    { name: "일상", img: normalIcon },
    { name: "학업", img: studyIcon },
  ];

  const handleAiChange = (e) => {
    const ai = e.target.value;
    setSelectedAi(ai);
    setFormData((prev) => ({ ...prev, aiEnvironment: ai }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
    setFormData((prev) => ({ ...prev, visible: scope === "공개" }));
  };

  // 초기 마운트 시 formData에서 visible 값이 있으면 selectedScope 설정
  useEffect(() => {
    if (formData.visible !== undefined && formData.visible !== null) {
      setSelectedScope(formData.visible ? "공개" : "비공개");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRegister = async () => {
    // 필수 필드 검증
    if (!formData.content.trim()) {
      alert("프롬프트 템플릿을 입력해주세요.");
      return;
    }
    if (!formData.title.trim()) {
      alert("프롬프트 제목을 입력해주세요.");
      return;
    }
    if (!formData.introduction.trim()) {
      alert("프롬프트 설명을 입력해주세요.");
      return;
    }
    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!selectedScope) {
      alert("공개 범위를 선택해주세요.");
      return;
    }

    setIsRegistering(true);

    try {
      // FormData 생성 (multipart/form-data)
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("introduction", formData.introduction);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", selectedCategory);
      formDataToSend.append(
        "visible",
        formData.visible !== null ? formData.visible.toString() : "false"
      );
      formDataToSend.append("result", ""); // 빈 문자열
      formDataToSend.append(
        "imageRequired",
        formData.imageRequired !== null
          ? formData.imageRequired.toString()
          : "false"
      );
      formDataToSend.append("aiEnvironment", selectedAi);

      // 이미지 파일 추가
      if (imageFile) {
        formDataToSend.append("file", imageFile);
      }

      const memberId = 1; // 로그인 기능이 없으므로 1로 고정
      const response = await apiClient.post(
        `/api/prompts/members/${memberId}`,
        formDataToSend
      );

      console.log("프롬프트 등록 성공:", response.data);
      alert("프롬프트가 성공적으로 등록되었습니다.");

      // 등록 성공 후 초기화 또는 리다이렉트
      // 예: window.location.href = "/hub";
    } catch (error) {
      console.error("프롬프트 등록 실패:", error);
      alert("프롬프트 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsRegistering(false);
    }
  };

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
      <CategoryInputSection>
        <TitleText>카테고리{!selectedCategory && "*"}</TitleText>
        <CategoryList>
          {categories.map((category) => (
            <CategoryTag
              key={category.name}
              name={category.name}
              img={category.img}
              isSelected={selectedCategory === category.name}
              onClick={() => handleCategoryChange(category.name)}
            />
          ))}
        </CategoryList>
      </CategoryInputSection>
      <BottomSection>
        <ScopeInputSection>
          <TitleText>공개 범위{!selectedScope && "*"}</TitleText>
          <ScopeList>
            <ScopeItem
              $isSelected={selectedScope === "공개"}
              onClick={() => handleScopeChange("공개")}
            >
              <ScopeIcon
                src={unlockIcon}
                alt="공개"
                $isSelected={selectedScope === "공개"}
              />
              <ScopeItemText $isSelected={selectedScope === "공개"}>
                공개
              </ScopeItemText>
            </ScopeItem>
            <ScopeItem
              $isSelected={selectedScope === "비공개"}
              onClick={() => handleScopeChange("비공개")}
            >
              <ScopeIcon
                src={lockIcon}
                alt="비공개"
                $isSelected={selectedScope === "비공개"}
              />
              <ScopeItemText $isSelected={selectedScope === "비공개"}>
                비공개
              </ScopeItemText>
            </ScopeItem>
          </ScopeList>
        </ScopeInputSection>
        <ImageInputSection>
          <TitleText>결과 이미지 등록</TitleText>
          <ImageSubTitleText>
            결과 이미지를 올리면 프롬프트의 매력이 더 잘 전달돼요.
            <br />
            특히 이미지 프롬프트의 경우 사용자들의 관심을 끌 수 있어요
          </ImageSubTitleText>
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
        </ImageInputSection>
      </BottomSection>
      <ButtonContainer>
        <PrevButton onClick={onPrev}>
          <PrevButtonIcon src={NextButtonIconImage} />
          <PrevButtonText>이전</PrevButtonText>
        </PrevButton>
        <RegisterButton onClick={handleRegister} disabled={isRegistering}>
          <RegisterButtonText>
            {isRegistering ? "등록 중..." : "등록"}
          </RegisterButtonText>
        </RegisterButton>
      </ButtonContainer>
    </OtherInputPageWrapper>
  );
}

const ScopeList = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: fit-content;
  margin-top: 1.5rem;
`;

const ScopeItem = styled.div`
  display: flex;
  padding: 0.38rem 1.25rem;
  border-radius: 7.5rem;
  border: 0.0625rem solid var(--Light-blue, #49d8ff);
  background: ${({ $isSelected }) => ($isSelected ? "#00C8FF" : "#fff")};
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const ScopeIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  flex-shrink: 0;
  filter: ${({ $isSelected }) =>
    $isSelected ? "brightness(0) invert(1)" : "none"};
  transition: filter 0.2s ease;
`;

const ScopeItemText = styled.span`
  color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#6ed1ff")};
  text-align: center;
  font-family: Pretendard;
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 500;
  transition: color 0.2s ease;
`;

const BottomSection = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  margin-top: 3.13rem;
`;

const ScopeInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
  height: fit-content;
`;

const ImageInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
  height: fit-content;
`;

const CategoryInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  margin-top: 3.13rem;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;
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

const ImageSubTitleText = styled.span`
  color: var(--B-T, #454545);
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-top: 0.5rem;
  line-height: 120%;
  letter-spacing: -0.02rem;
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

const Content = styled.div`
  color: var(--B-T, #454545);
  font-family: Pretendard;
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.014375rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5.37rem;
`;

const PrevButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: #f3f3f3;
  padding: 0.72rem 1rem;
  border: none;
`;

const PrevButtonIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  display: block;
  flex-shrink: 0;
  transform: rotate(180deg);
  margin-right: 0.2rem;
`;

const PrevButtonText = styled.span`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
`;

const RegisterButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: var(--Icon-, #001e40);
  padding: 0.72rem 1rem;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RegisterButtonText = styled.span`
  color: #fff;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
`;
