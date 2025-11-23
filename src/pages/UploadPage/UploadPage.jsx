import React, { useState } from "react";
import styled from "styled-components";
import promptTemplate from "./assets/promptTemplate.svg";
import infoIcon from "./assets/infoIcon.svg";
import otherIcon from "./assets/otherIcon.svg";
import NextButtonIconImage from "./assets/nextButtonIcon.svg";
import UploadTemplate from "./UploadTemplatePage";
import TitleInputPage from "./TitleInputPage";
import OtherInputPage from "./OtherInputPage";
import apiClient from "../../api/client";

export default function UploadPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);

  // 모든 페이지의 데이터를 UploadPage에서 관리
  const [formData, setFormData] = useState({
    // UploadTemplatePage
    content: "",
    imageRequired: null, // 이미지 필수 여부 (null: 미선택, true: 예, false: 아니오)
    // TitleInputPage
    title: "",
    introduction: "",
    // OtherInputPage
    aiEnvironment: "Chat GPT",
    category: "",
    visible: null, // 공개=true, 비공개=false, null=미선택
    file: null,
    resultType: "image",
    result: "",
  });

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
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
    if (!formData.category) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (formData.visible === null || formData.visible === undefined) {
      alert("공개 범위를 선택해주세요.");
      return;
    }
    if (
      formData.resultType === "text" &&
      (!formData.result || !formData.result.trim())
    ) {
      alert("결과 텍스트를 입력해주세요.");
      return;
    }

    setIsRegistering(true);

    try {
      // FormData 생성 (multipart/form-data)
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("introduction", formData.introduction);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append(
        "visible",
        formData.visible !== null ? formData.visible.toString() : "false"
      );
      formDataToSend.append(
        "result",
        formData.resultType === "text" ? formData.result : ""
      );
      formDataToSend.append(
        "imageRequired",
        formData.imageRequired !== null
          ? formData.imageRequired.toString()
          : "false"
      );
      formDataToSend.append("aiEnvironment", formData.aiEnvironment);

      // 이미지 파일 추가
      if (formData.resultType !== "text" && formData.file) {
        formDataToSend.append("file", formData.file);
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

  // 현재 페이지에 따라 다음 버튼 활성화 여부 결정
  const isNextDisabled = () => {
    switch (currentPage) {
      case 0:
        return !formData.content.trim() || formData.imageRequired === null;
      case 1:
        return (
          !formData.title.trim() ||
          !formData.introduction.trim() ||
          !formData.category ||
          formData.visible === null
        );
      case 2:
        if (formData.resultType === "text") {
          return !formData.result.trim();
        }
        return false; // 마지막 페이지는 등록 버튼이므로 항상 활성화(단, 등록 중일 때는 제외)
      default:
        return true;
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <UploadTemplate
            content={formData.content}
            setContent={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
            imageRequired={formData.imageRequired}
            setImageRequired={(imageRequired) =>
              setFormData((prev) => ({ ...prev, imageRequired }))
            }
          />
        );
      case 1:
        return (
          <TitleInputPage
            title={formData.title}
            setTitle={(title) => setFormData((prev) => ({ ...prev, title }))}
            introduction={formData.introduction}
            setIntroduction={(introduction) =>
              setFormData((prev) => ({ ...prev, introduction }))
            }
            category={formData.category}
            setCategory={(category) =>
              setFormData((prev) => ({ ...prev, category }))
            }
            visible={formData.visible}
            setVisible={(visible) =>
              setFormData((prev) => ({ ...prev, visible }))
            }
          />
        );
      case 2:
        return (
          <OtherInputPage
            formData={formData}
            setFormData={setFormData}
            setImageFile={(file) => setFormData((prev) => ({ ...prev, file }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <UploadPageWrapper>
      <ProgressBar>
        <ProgressBarItem $isActive={currentPage === 0}>
          <ProgressBarItemText $isActive={currentPage === 0}>
            프롬프트 템플릿
          </ProgressBarItemText>
          <ProgressBarItemImage
            src={promptTemplate}
            $isActive={currentPage === 0}
          />
        </ProgressBarItem>
        <ProgressBarItem $isActive={currentPage === 1}>
          <ProgressBarItemText $isActive={currentPage === 1}>
            제목 / 설명
          </ProgressBarItemText>
          <ProgressBarItemImage src={infoIcon} $isActive={currentPage === 1} />
        </ProgressBarItem>
        <ProgressBarItem $isActive={currentPage === 2}>
          <ProgressBarItemText $isActive={currentPage === 2}>
            기타
          </ProgressBarItemText>
          <ProgressBarItemImage src={otherIcon} $isActive={currentPage === 2} />
        </ProgressBarItem>
      </ProgressBar>
      <ContentWrapper>{renderCurrentPage()}</ContentWrapper>

      <ButtonContainer>
        {currentPage > 0 && (
          <PrevButton onClick={handlePrev}>
            <PrevButtonIcon src={NextButtonIconImage} />
            <PrevButtonText>이전</PrevButtonText>
          </PrevButton>
        )}
        {currentPage < 2 ? (
          <NextButton onClick={handleNext} disabled={isNextDisabled()}>
            <NextButtonText>다음</NextButtonText>
            <NextButtonIcon src={NextButtonIconImage} />
          </NextButton>
        ) : (
          <RegisterButton onClick={handleRegister} disabled={isRegistering}>
            <RegisterButtonText>
              {isRegistering ? "등록 중..." : "등록"}
            </RegisterButtonText>
          </RegisterButton>
        )}
      </ButtonContainer>
    </UploadPageWrapper>
  );
}

const ContentWrapper = styled.div`
  margin-top: 2rem;
  width: 70vw;
  height: 72%;
  /* 각 페이지 컴포넌트가 이 영역을 채우도록 함 */
  display: flex;
  flex-direction: column;
`;

const UploadPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
  align-items: center;
  padding-bottom: 5rem; /* 하단 여백 확보 */
`;

const ProgressBar = styled.div`
  width: 36vw;
  height: 5rem;
  display: flex;
  justify-content: space-between;
`;

const ProgressBarItem = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: calc(50% + 1.6rem);
    top: calc(50% + 1.1rem);
    width: calc(100% - 4rem);
    height: 0.0625rem;
    background-color: var(--Line_Blue-light, #aadff7);
  }
`;

const ProgressBarItemText = styled.span`
  color: ${(props) =>
    props.$isActive ? "var(--B-Blue-line, #00aeff)" : "#E0F5FF"};
  text-align: center;
  font-family: Pretendard;
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
`;

const ProgressBarItemImage = styled.img`
  width: 2.8rem;
  height: 2.8rem;
  object-fit: contain;
  display: block;
  opacity: ${(props) => (props.$isActive ? 1 : 0.6)};
  filter: ${(props) =>
    props.$isActive ? "none" : "brightness(1.2) saturate(0.5)"};
  transition: opacity 0.3s ease, filter 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70vw; /* 컨텐츠 너비와 맞춤 */
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
  cursor: pointer;
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

const NextButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: #f3f3f3;
  padding: 0.72rem 1rem;
  border: none;
  cursor: pointer;
  margin-left: auto; /* 이전 버튼이 없을 때 오른쪽 정렬을 위해 */

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NextButtonText = styled.span`
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

const NextButtonIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  display: block;
  flex-shrink: 0;
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
