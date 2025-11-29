import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ChatBar from "../../components/ChatSection/ChatBar";
import apiClient from "../../api/client";
import heartIcon from "./assets/detailLikeIcon.svg";
import detailHeartIcon from "./assets/grayHeartIcon.svg";
import detailViewIcon from "./assets/detailViewIcon.svg";
import detailCopyIcon from "./assets/detailCopyIcon.svg";
import detailRecommendIcon from "./assets/detailRecommendIcon.svg";
import detailImageRequiredIcon from "./assets/detailImageRequiredIcon.svg";
import detailResultIcon from "./assets/detailResultIcon.svg";
import detailEditIcon from "./assets/detailEditIcon.svg";
import detailDirectUseIcon from "./assets/detailDirectUseIcon.svg";
import detailCopyButtonIcon from "./assets/detailCopyButtonIcon.svg";
import detailPromptIcon from "./assets/detailPromptIcon.svg";

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

export default function PromptDetailPage() {
  const { promptId } = useParams();
  const [promptData, setPromptData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromptDetail = async () => {
      setIsLoading(true);
      try {
        const memberId = 1; // 임시 memberId
        const { data } = await apiClient.get(
          `/api/prompts/${promptId}?memberId=${memberId}`
        );
        setPromptData(data);
      } catch (err) {
        console.error("프롬프트 상세 정보 로딩 실패:", err);
        setError("프롬프트 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (promptId) {
      fetchPromptDetail();
    }
  }, [promptId]);

  return (
    <MainSection>
      <LeftSection>
        <TitlePart>
          <CategoryTag>{promptData?.category}</CategoryTag>
          <Title>{promptData?.title}</Title>
          <LikeButton src={heartIcon} />
        </TitlePart>
        <WriterInfo>
          <WriterImg src={promptData?.imageUrl} />
          <InfoSection>
            <WriterName>{promptData?.name}</WriterName>
            <InfoBottomSection>
              <InfoItem>
                <InfoIcon src={detailViewIcon} />
                <InfoText>{promptData?.viewCount}</InfoText>
                <InfoIcon src={detailHeartIcon} />
                <InfoText>{promptData?.likeCount}</InfoText>
                <InfoIcon src={detailCopyIcon} />
                <InfoText>{promptData?.copyCount}</InfoText>
              </InfoItem>
            </InfoBottomSection>
          </InfoSection>
          <InfoTime>{formatDate(promptData?.createdAt)}</InfoTime>
        </WriterInfo>
        <IntroductionSection>{promptData?.introduction}</IntroductionSection>
        <LeftBottomSection>
          <BottomFirstSection>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.69rem", marginTop: "1.19rem", marginBottom: "1rem" }}>
              <PromptInfoSection>
              <TemplateSection>
                <PromptInfoSectionIcon src={detailRecommendIcon} />
                <PromptInfoSectionText>추천 AI</PromptInfoSectionText>
              </TemplateSection>
              <AiEnvironmentText>{promptData?.aiEnvironment}</AiEnvironmentText>
            </PromptInfoSection>
            <PromptInfoSection>
              <TemplateSection>
                <PromptInfoSectionIcon src={detailImageRequiredIcon} />
                <PromptInfoSectionText>이미지 필요 여부</PromptInfoSectionText>
              </TemplateSection>
            </PromptInfoSection>
            </div>
            <div style={{display: "flex", height: "1.625rem", alignItems: "center"}}>
              <img src={detailPromptIcon} />
            </div>
          </BottomFirstSection>
          <BottomSecondSection></BottomSecondSection>
        </LeftBottomSection>
      </LeftSection>
      <RightSection>
        <ChatBar />
      </RightSection>
    </MainSection>
  );
}

const MainSection = styled.div`
  display: flex;
  height: 100%;
  font-family: "Pretendard Variable", sans-serif;
  overflow: hidden;
`;

const LeftSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 67vw;
  height: 100%;
  max-height: 100%;
  background-color: #fff;
  overflow-y: auto;
  padding: 3rem 6rem;
`;

const RightSection = styled.section`
  width: 33vw;
  height: 100%;
  max-height: 100%;
  border-left: 1px solid #aadff7;
  background: #f1f1f1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TitlePart = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 2px solid #aadff7;
  padding-bottom: 1rem;
`;

const CategoryTag = styled.div`
  font-family: "Pretendard Variable", sans-serif;
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
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 600;
`;

const LikeButton = styled.img`
  width: 2.56694rem;
  height: 2.56694rem;
  margin-left: auto;
  cursor: pointer;
  align-self: flex-end;
  margin-bottom: -0.2rem;
`;

const WriterInfo = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1.31rem;
  justify-content: flex-start;
`;

const WriterImg = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 1.25rem;
  border-radius: 1rem;
`;

const WriterName = styled.div`
  color: #000;
  text-align: left;
  font-family: "Pretendard Variable";
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.9375rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: flex-end;
`;

const InfoBottomSection = styled.div`
  display: flex;
  gap: 1.4rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 0.38rem;
`;

const InfoIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const InfoText = styled.div`
  color: #a6a6a6;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem;
`;

const InfoTime = styled.div`
  color: #a6a6a6;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.4375rem;
  margin-left: auto;
  margin-top: -0.35rem;
`;

const IntroductionSection = styled.div`
  width: 55%;
  padding: 1.06rem 1.62rem;
  background: #f5fcff;
  color: #000;
  background: #f5fcff;
  text-align: left;
  align-self: flex-start;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  margin-top: 1.5rem;
`;

const LeftBottomSection = styled.div`
  display: flex;
  width: 100%;
`;

const BottomFirstSection = styled.div``;
const BottomSecondSection = styled.div``;
const PromptInfoSection = styled.div`
  display: flex;
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
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
`;

const AiEnvironmentText = styled.div`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard Variable";
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