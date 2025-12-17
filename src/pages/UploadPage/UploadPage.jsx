import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import promptTemplate from "./assets/promptTemplate.svg";
import infoIcon from "./assets/infoIcon.svg";
import otherIcon from "./assets/otherIcon.svg";
import NextButtonIconImage from "./assets/nextButtonIcon.svg";
import UploadTemplate from "./UploadTemplatePage";
import TitleInputPage from "./TitleInputPage";
import OtherInputPage from "./OtherInputPage";
import apiClient from "../../api/client";
import { useCopyModal } from "../../contexts/CopyModalContext";
import LoginRequiredModal from "../../components/LoginRequiredModal/LoginRequiredModal";
import WarningIcon from "../../components/LoginRequiredModal/assets/warningIcon.svg";

export default function UploadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showCopyModal } = useCopyModal();
  const editMode = Boolean(location.state?.editMode);
  const editPromptData = location.state?.promptData;
  const editPromptId = editPromptData?.promptId;

  const [currentPage, setCurrentPage] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    existingImageUrl: "",
    removeImage: false,
  });

  // edit mode 초기 데이터 세팅
  useEffect(() => {
    if (!editMode || !editPromptData) return;

    setFormData((prev) => ({
      ...prev,
      content: editPromptData.content || "",
      imageRequired:
        typeof editPromptData.imgRequired === "boolean"
          ? editPromptData.imgRequired
          : typeof editPromptData.imageRequired === "boolean"
          ? editPromptData.imageRequired
          : prev.imageRequired,
      title: editPromptData.title || "",
      introduction: editPromptData.introduction || "",
      aiEnvironment: editPromptData.aiEnvironment || "Chat GPT",
      category: editPromptData.category || "",
      visible:
        typeof editPromptData.visible === "boolean"
          ? editPromptData.visible
          : prev.visible,
      resultType: editPromptData.imageUrl ? "image" : "text",
      result: editPromptData.result || "",
      existingImageUrl: editPromptData.imageUrl || "",
      file: null,
      removeImage: false,
    }));
  }, [editMode, editPromptData]);

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleRegister = async () => {
    setIsRegistering(true);

    try {
      const hasExistingImage = Boolean(formData.existingImageUrl);
      const hasNewFile = Boolean(formData.file);
      const isImageResult = formData.resultType === "image";

      // removeImage 결정 로직
      let removeImageFlag = Boolean(formData.removeImage);
      if (isImageResult) {
        // 새 이미지가 있으면 제거 플래그는 해제
        if (hasNewFile) {
          removeImageFlag = false;
        }
        // 이미지 모드에서는 result는 빈 문자열로 전송
        formData.result = "";
      } else {
        // 텍스트 모드로 전환 시 기존 이미지가 있으면 제거
        if (hasExistingImage) {
          removeImageFlag = true;
        }
      }

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
        formData.resultType === "text" ? formData.result || "" : ""
      );
      formDataToSend.append(
        "imageRequired",
        formData.imageRequired !== null
          ? formData.imageRequired.toString()
          : "false"
      );
      formDataToSend.append("aiEnvironment", formData.aiEnvironment);
      formDataToSend.append("removeImage", removeImageFlag ? "true" : "false");

      // 이미지 파일 추가 (새 업로드 시)
      if (formData.resultType !== "text" && formData.file) {
        formDataToSend.append("file", formData.file);
      }

      let response;
      if (editMode && editPromptId) {
        response = await apiClient.patch(
          `/api/prompts/${editPromptId}`,
          formDataToSend
        );
        console.log("프롬프트 수정 성공:", response.data);
        navigate("/");
        showCopyModal("수정이 완료되었습니다");
      } else {
        response = await apiClient.post(`/api/prompts`, formDataToSend);
        console.log("프롬프트 등록 성공:", response.data);
        navigate("/");
        showCopyModal("업로드가 완료되었습니다");
      }
    } catch (error) {
      console.error("프롬프트 등록/수정 실패:", error);
      setErrorMessage("프롬프트 처리에 실패했습니다. 다시 시도해주세요.");
      setIsErrorModalOpen(true);
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
            setImageFile={(file) =>
              setFormData((prev) => ({
                ...prev,
                file,
                existingImageUrl: "",
                removeImage: false,
              }))
            }
            onRemoveImage={() =>
              setFormData((prev) => ({
                ...prev,
                file: null,
                existingImageUrl: "",
                removeImage: true,
              }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
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
            <ProgressBarItemImage
              src={infoIcon}
              $isActive={currentPage === 1}
            />
          </ProgressBarItem>
          <ProgressBarItem $isActive={currentPage === 2}>
            <ProgressBarItemText $isActive={currentPage === 2}>
              기타
            </ProgressBarItemText>
            <ProgressBarItemImage
              src={otherIcon}
              $isActive={currentPage === 2}
            />
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
                {isRegistering
                  ? editMode
                    ? "수정 중..."
                    : "등록 중..."
                  : editMode
                  ? "수정"
                  : "등록"}
              </RegisterButtonText>
            </RegisterButton>
          )}
        </ButtonContainer>
      </UploadPageWrapper>
      <LoginRequiredModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        icon={WarningIcon}
        text={errorMessage || "오류가 발생했습니다"}
        buttonText="허브로 이동"
        onButtonClick={() => {
          navigate("/");
          setIsErrorModalOpen(false);
        }}
        showCloseButton={false}
      />
    </>
  );
}

const ContentWrapper = styled.div`
  margin-top: 2rem;
  width: 70vw;
  height: 72%;
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
  font-family: "Pretendard";
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
  font-family: "Pretendard";
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
  font-family: "Pretendard";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
`;
