import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getPromptDetail } from "../../api";
import detailHeartIcon from "../../../PromptDetailPage/assets/detailHeartIcon.svg";
import detailViewIcon from "../../../PromptDetailPage/assets/detailViewIcon.svg";
import detailCopyIcon from "../../../PromptDetailPage/assets/detailCopyIcon.svg";
import detailRecommendIcon from "../../../PromptDetailPage/assets/detailRecommendIcon.svg";
import detailImageRequiredIcon from "../../../PromptDetailPage/assets/detailImageRequiredIcon.svg";
import detailResultIcon from "../../../PromptDetailPage/assets/detailResultIcon.svg";
import detailPromptIcon from "../../../PromptDetailPage/assets/detailPromptIcon.svg";
import apiClient from "../../../../api/client";
import { useCopyModal } from "../../../../contexts/CopyModalContext";

const formatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function PromptDetailModal({ isOpen, onClose, promptId }) {
  const [promptData, setPromptData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showCopyModal } = useCopyModal();

  const fetchPromptDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const memberId = localStorage.getItem("memberId");
      const params = {};
      if (memberId) {
        params.memberId = Number(memberId);
      }
      const data = await getPromptDetail(promptId, params);
      setPromptData(data);
    } catch (err) {
      console.error("프롬프트 상세 정보 로딩 실패:", err);
      setError("프롬프트 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!promptId) return;
    try {
      const response = await apiClient.patch(`/api/prompts/${promptId}/copy`);
      if (response.data && response.data.content) {
        await navigator.clipboard.writeText(response.data.content);
        showCopyModal();
      } else {
        alert("복사할 내용이 없습니다.");
      }
    } catch (copyError) {
      console.error("프롬프트 복사 실패:", copyError);
      alert("프롬프트 내용을 복사하는데 실패했습니다.");
    }
  };

  useEffect(() => {
    console.log(
      "PromptDetailModal useEffect - isOpen:",
      isOpen,
      "promptId:",
      promptId
    );
    if (isOpen && promptId) {
      console.log("프롬프트 상세 정보 가져오기 시작");
      fetchPromptDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, promptId]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  console.log(
    "PromptDetailModal render - isOpen:",
    isOpen,
    "promptId:",
    promptId
  );

  if (!isOpen) {
    console.log("모달이 닫혀있음 - 렌더링하지 않음");
    return null;
  }

  console.log("모달 렌더링 시작");

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalBody>
          {isLoading ? (
            <LoadingMessage>로딩 중...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : promptData ? (
            <>
              <TitlePart>
                <CategoryTag>{promptData?.category}</CategoryTag>
                <Title>{promptData?.title}</Title>
              </TitlePart>
              <InfoTime>{formatDate(promptData?.createdAt)}</InfoTime>
              <WriterInfo>
                <WriterImg src={promptData?.imageUrl} alt="작성자" />
                <InfoSection>
                  <WriterName>{promptData?.name}</WriterName>
                  <InfoBottomSection>
                    <InfoItem>
                      <InfoIcon src={detailViewIcon} alt="조회수" />
                      <InfoText>{promptData?.viewCount || 0}</InfoText>
                      <InfoIcon src={detailHeartIcon} alt="좋아요" />
                      <InfoText>{promptData?.likeCount || 0}</InfoText>
                      <InfoIcon src={detailCopyIcon} alt="복사" />
                      <InfoText>{promptData?.copyCount || 0}</InfoText>
                    </InfoItem>
                  </InfoBottomSection>
                </InfoSection>
              </WriterInfo>
              <IntroductionSection>
                <IntroductionText>{promptData?.introduction}</IntroductionText>
              </IntroductionSection>
              <LeftBottomSection>
                <BottomFirstSection>
                  <PromptInfoWrapper>
                    <PromptInfoSection>
                      <TemplateSection>
                        <PromptInfoSectionIcon src={detailRecommendIcon} />
                        <PromptInfoSectionText>추천 AI</PromptInfoSectionText>
                      </TemplateSection>
                      <AiEnvironmentText>
                        {promptData?.aiEnvironment}
                      </AiEnvironmentText>
                    </PromptInfoSection>
                    <PromptInfoSection>
                      <TemplateSection>
                        <PromptInfoSectionIcon src={detailImageRequiredIcon} />
                        <PromptInfoSectionText>
                          이미지 필요 여부
                        </PromptInfoSectionText>
                      </TemplateSection>
                      <AiEnvironmentText>
                        {promptData?.imageRequired ? "예" : "아니요"}
                      </AiEnvironmentText>
                    </PromptInfoSection>
                  </PromptInfoWrapper>
                  <PromptIconWrapper>
                    <PromptIconContainer>
                      <PromptIconImg src={detailPromptIcon} alt="프롬프트" />
                      <PromptIconText>프롬프트</PromptIconText>
                      <PromptIconDetail>
                        [대괄호]안에 내용은 사용자가 직접 입력해야합니다.
                      </PromptIconDetail>
                    </PromptIconContainer>
                  </PromptIconWrapper>
                  <PromptContent>{promptData?.content}</PromptContent>
                  <ButtonContainer>
                    <RightButtonGroup>
                      <DetailButton onClick={handleCopyPrompt}>
                        <DetailButtonText>복사하기</DetailButtonText>
                      </DetailButton>
                    </RightButtonGroup>
                  </ButtonContainer>
                </BottomFirstSection>
                <BottomSecondSection>
                  <PromptResultWrapper>
                    <PromptResultIconContainer>
                      <PromptResultIconImg
                        src={detailResultIcon}
                        alt="프롬프트 실행 결과"
                      />
                      <PromptResultIconText>
                        프롬프트 실행 결과
                      </PromptResultIconText>
                    </PromptResultIconContainer>
                  </PromptResultWrapper>
                  <PromptResultContent>
                    {promptData?.imageUrl ? (
                      <ResultImage
                        src={promptData.imageUrl}
                        alt="프롬프트 실행 결과"
                      />
                    ) : promptData?.result ? (
                      <ResultText>{promptData?.result}</ResultText>
                    ) : (
                      <ResultTextEmpty>
                        실행 결과 예시가 없습니다.
                      </ResultTextEmpty>
                    )}
                  </PromptResultContent>
                </BottomSecondSection>
              </LeftBottomSection>
            </>
          ) : null}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 30, 64, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const PromptInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.69rem;
  margin-top: 1.19rem;
  margin-bottom: 1rem;
`;

const PromptIconWrapper = styled.div`
  display: flex;
  height: 1.625rem;
  margin-left: 0.75rem;
  align-items: center;
`;

const PromptIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PromptIconImg = styled.img`
  width: auto;
  height: auto;
`;

const PromptIconText = styled.div`
  color: #000;
  text-align: center;
  font-family: "Pretendard", sans-serif;
  font-size: 1rem;
  font-weight: 600;
`;

const PromptResultWrapper = styled.div`
  display: flex;
  height: 1.625rem;
  margin-left: 0.75rem;
  align-items: center;
`;

const PromptResultIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PromptResultIconImg = styled.img`
  width: auto;
  height: auto;
`;

const PromptResultIconText = styled.div`
  color: #000;
  text-align: center;
  font-family: "Pretendard", sans-serif;
  font-size: 1rem;
  font-weight: 600;
`;

const ModalContent = styled.div`
  width: 71.875rem; /* 1150px */
  max-width: 90vw;
  max-height: 90vh;
  background-color: #ffffff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const ModalBody = styled.div`
  flex: 1;
  min-height: 0;
  padding: 4.31rem 3rem;
  display: flex;
  flex-direction: column;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #848484;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ff0000;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
`;

const TitlePart = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 0.125rem solid #aadff7;
  padding-bottom: 0.69rem;
  align-items: center;
`;

const CategoryTag = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 1.1875rem;
  font-weight: 600;
  padding: 0.62rem;
  background-color: #e0f5ff;
  color: #000;
  border-radius: 7.5rem;
  margin-right: 1.37rem;
`;

const Title = styled.div`
  color: #001e40;
  text-align: left;
  font-family: "Pretendard";
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0%;

  flex: 1;
`;

const WriterInfo = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1.31rem;
  justify-content: flex-start;
  align-items: center;
`;

const WriterImg = styled.img`
  width: 3.6875rem;
  height: 3.6875rem;
  margin-right: 1.25rem;
  border-radius: 0.6418rem;
  object-fit: cover;
`;

const WriterName = styled.div`
  color: #000;
  text-align: left;
  font-family: "Pretendard";
  font-size: 1.3125rem;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: 0%;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: flex-end;
  flex: 1;
`;

const InfoBottomSection = styled.div`
  display: flex;
  gap: 1.4rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 0.38rem;
  align-items: center;
`;

const InfoIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const InfoText = styled.div`
  color: #a6a6a6;
  text-align: center;
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem;
`;

const InfoTime = styled.div`
  color: #a6a6a6;
  text-align: center;
  font-family: "Pretendard";
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 100%;
  margin-left: auto;
  margin-top: 0.69rem;
`;

const IntroductionSection = styled.div`
  width: 60%;
  padding: 1.06rem 1.62rem;
  background: #f5fcff;
  text-align: left;
  align-self: flex-start;
  margin-top: 1.5rem;
  box-sizing: border-box;
`;

const IntroductionText = styled.div`
  color: #000;
  font-family: "Pretendard";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.4;
  word-break: break-word;
  max-height: calc(1.1875rem * 1.4 * 2);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
  }
`;

const LeftBottomSection = styled.div`
  display: flex;
  width: 100%;
  gap: 2rem;
  margin-top: 2rem;
`;

const BottomFirstSection = styled.div`
  width: 56%;
  flex-shrink: 0;
`;

const BottomSecondSection = styled.div`
  width: 38%;
  margin-top: 1.19rem;
  flex-shrink: 0;
`;

const PromptInfoSection = styled.div`
  display: flex;
  margin-left: 1.13rem;
  align-items: center;
  gap: 3rem;
`;

const PromptInfoSectionIcon = styled.img`
  width: 1.625rem;
  height: 1.625rem;
`;

const PromptInfoSectionText = styled.div`
  color: #000;
  text-align: center;
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
`;

const AiEnvironmentText = styled.div`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

const TemplateSection = styled.div`
  display: flex;
  width: 9rem;
  align-items: center;
  gap: 0.5rem;
`;

const PromptContent = styled.div`
  width: 100%;
  height: 24rem;
  margin-top: 0.75rem;
  border-radius: 1rem;
  border: 0.0625rem solid var(--Line_Blue-light, #aadff7);
  padding: 1rem 1.44rem;
  color: #000;
  overflow-y: auto;
  font-family: "Pretendard";
  font-size: 0.875rem;
  font-weight: 500;
`;

const PromptIconDetail = styled.div`
  color: #929292;
  font-size: 0.9627rem;
  font-weight: 500;
  line-height: 120%;
  letter-spacing: -2%;
`;

const PromptResultContent = styled.div`
  width: 100%;
  margin-top: 1.25rem;
  padding: 0rem 1rem;
`;

const ResultImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 1rem;
  object-fit: contain;
`;

const ResultText = styled.div`
  color: #000;
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  max-height: 29rem;
  overflow-y: auto;
`;

const ResultTextEmpty = styled(ResultText)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 8rem;
`;

const DetailButton = styled.div`
  display: flex;
  gap: 0.62rem;
  padding: 0.62rem;
  align-items: center;
  cursor: pointer;
  border-radius: 0.5rem;
  background: linear-gradient(
    87deg,
    var(--B-Blue-line, #00aeff) -43%,
    #6ed1ff 147.28%
  );
`;

const DetailButtonText = styled.div`
  color: #ffffff;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 700;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  gap: 1rem;
  align-items: center;
  margin-top: 0.94rem;
`;

const RightButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;
