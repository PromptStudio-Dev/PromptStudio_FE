import React, { useState } from "react";
import styled from "styled-components";
import promptTemplate from "./assets/promptTemplate.svg";
import infoIcon from "./assets/infoIcon.svg";
import otherIcon from "./assets/otherIcon.svg";
import UploadTemplate from "./UploadTemplatePage";
import TitleInputPage from "./TitleInputPage";
import OtherInputPage from "./OtherInputPage";

export default function UploadPage() {
  const [currentPage, setCurrentPage] = useState(0);

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
  });

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <UploadTemplate
            onNext={handleNext}
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
            onNext={handleNext}
            onPrev={handlePrev}
            title={formData.title}
            setTitle={(title) => setFormData((prev) => ({ ...prev, title }))}
            introduction={formData.introduction}
            setIntroduction={(introduction) =>
              setFormData((prev) => ({ ...prev, introduction }))
            }
          />
        );
      case 2:
        return (
          <OtherInputPage
            onPrev={handlePrev}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return (
          <UploadTemplate
            onNext={handleNext}
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
    </UploadPageWrapper>
  );
}

const ContentWrapper = styled.div`
  margin-top: 4rem;
  width: 70vw;
  height: 100%;
`;

const UploadPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 5.13rem;
  align-items: center;
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
