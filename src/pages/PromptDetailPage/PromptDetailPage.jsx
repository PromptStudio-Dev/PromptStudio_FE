import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import ChatBar from "../../components/ChatSection/ChatBar";
import apiClient from "../../api/client";
import { getMemberId } from "../../utils/authStorage";
import heartIcon from "./assets/detailLikeIcon.svg";
import heartSelectedIcon from "./assets/detailLikeSelectedIcon.svg";
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
  const navigate = useNavigate();
  const [promptData, setPromptData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const currentMemberId = getMemberId();
  const isOwner =
    promptData?.memberId &&
    currentMemberId &&
    String(promptData.memberId) === String(currentMemberId);

  useEffect(() => {
    const fetchPromptDetail = async () => {
      setIsLoading(true);
      try {
        const memberId = 1; // 임시 memberId
        const { data } = await apiClient.get(
          `/api/prompts/${promptId}?memberId=${memberId}`
        );
        setPromptData(data);
        setIsLiked(Boolean(data?.liked));
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

  const handleCopyPrompt = async () => {
    if (!promptId) return;
    try {
      const response = await apiClient.patch(`/api/prompts/${promptId}/copy`);
      if (response.data && response.data.content) {
        await navigator.clipboard.writeText(response.data.content);
      } else {
        alert("복사할 내용이 없습니다.");
      }
    } catch (copyError) {
      console.error("프롬프트 복사 실패:", copyError);
      alert("프롬프트 내용을 복사하는데 실패했습니다.");
    }
  };

  const handleDirectUse = () => {
    if (!promptData?.promptId) return;

    const payload = {
      promptId: promptData.promptId,
      category: promptData.category ?? "미분류",
      aiName: promptData.aiEnvironment ?? "AI",
      title: promptData.title ?? "제목 미상",
      subtitle: promptData.introduction ?? "",
      backgroundImage: promptData.imageUrl || "",
      initialLiked: promptData.liked || false,
      imageRequired:
        promptData.imgRequired ?? promptData.imageRequired ?? false,
    };

    window.dispatchEvent(new CustomEvent("use-prompt", { detail: payload }));
  };

  const handleLikeToggle = async () => {
    if (!promptId) return;
    try {
      const { data } = await apiClient.post(`/api/prompts/${promptId}/likes`);
      if (data) {
        setIsLiked(Boolean(data.liked));
        setPromptData((prev) =>
          prev ? { ...prev, liked: Boolean(data.liked) } : prev
        );
      }
    } catch (err) {
      console.error("좋아요 요청 실패:", err);
      alert("좋아요 요청에 실패했습니다.");
    }
  };

  return (
    <MainSection>
      <LeftSection>
        <TitlePart>
          <CategoryTag>{promptData?.category}</CategoryTag>
          <Title>{promptData?.title}</Title>
          <LikeButton
            src={isLiked ? heartSelectedIcon : heartIcon}
            onClick={handleLikeToggle}
          />
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
        <IntroductionSection>
          <IntroductionText>{promptData?.introduction}</IntroductionText>
        </IntroductionSection>
        <LeftBottomSection>
          <BottomFirstSection>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.69rem",
                marginTop: "1.19rem",
                marginBottom: "1rem",
              }}
            >
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
            </div>
            <div
              style={{
                display: "flex",
                height: "1.625rem",
                marginLeft: "0.75rem",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <img src={detailPromptIcon} />
                <div
                  style={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Pretendard Variable, sans-serif",
                    fontSize: "1.1875rem",
                    fontStyle: "normal",
                    fontWeight: "600",
                  }}
                >
                  프롬프트
                </div>
              </div>
            </div>
            <PromptContent>{promptData?.content}</PromptContent>
            <ButtonContainer>
              {isOwner && (
                <DetailButton
                  onClick={() =>
                    navigate("/upload", {
                      state: {
                        editMode: true,
                        promptData: {
                          ...promptData,
                          imageRequired:
                            promptData?.imgRequired ??
                            promptData?.imageRequired ??
                            false,
                        },
                      },
                    })
                  }
                >
                  <DetailButtonIcon src={detailEditIcon} />
                  <DetailButtonText>수정하기</DetailButtonText>
                </DetailButton>
              )}
              <RightButtonGroup>
                <DetailButton onClick={handleCopyPrompt}>
                  <DetailButtonIcon src={detailCopyButtonIcon} />
                  <DetailButtonText>복사하기</DetailButtonText>
                </DetailButton>
                <DirectUseButton onClick={handleDirectUse}>
                  <DetailButtonIcon src={detailDirectUseIcon} />
                  <DirectUseButtonText>바로 사용하기</DirectUseButtonText>
                </DirectUseButton>
              </RightButtonGroup>
            </ButtonContainer>
          </BottomFirstSection>
          <BottomSecondSection>
            <div
              style={{
                display: "flex",
                height: "1.625rem",
                marginLeft: "0.75rem",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <img src={detailResultIcon} />
                <div
                  style={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Pretendard Variable, sans-serif",
                    fontSize: "1.1875rem",
                    fontStyle: "normal",
                    fontWeight: "normal",
                  }}
                >
                  프롬프트 실행 결과
                </div>
              </div>
            </div>
            <PromptResultContent>
              {promptData?.imageUrl ? (
                <ResultImage
                  src={promptData.imageUrl}
                  alt="프롬프트 실행 결과"
                />
              ) : promptData?.result ? (
                <ResultText>{promptData?.result}</ResultText>
              ) : (
                <ResultTextEmpty>실행 결과 예시가 없습니다.</ResultTextEmpty>
              )}
            </PromptResultContent>
          </BottomSecondSection>
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
  text-align: left;
  align-self: flex-start;
  margin-top: 1.5rem;
  box-sizing: border-box;
`;

const IntroductionText = styled.div`
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.4;
  word-break: break-word;

  /* 3줄까지는 박스가 커지고, 그 이후부터는 스크롤 */
  /* 1.1875rem(폰트) * 1.4(line-height) * 3줄 */
  max-height: calc(1.1875rem * 1.4 * 3);
  overflow-y: auto;

  /* 스크롤바 스타일 */
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
`;

const BottomFirstSection = styled.div`
  width: 56%;
`;

const BottomSecondSection = styled.div`
  width: 38%;
  margin-top: 1.19rem;
  margin-left: auto;
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

const PromptContent = styled.div`
  width: 100%;
  height: 24rem;
  margin-top: 1.62rem;
  border-radius: 1rem;
  border: 1px solid var(--Line_Blue-light, #aadff7);
  padding: 2.19rem 2.31rem;
  color: #000;
  overflow-y: auto;

  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
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
  border: 1px solid var(--Light-blue, #49d8ff);
`;

const DetailButtonIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const DetailButtonText = styled.div`
  color: var(--B-Blue-line, #00aeff);
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 600;
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

const DirectUseButton = styled(DetailButton)`
  background: linear-gradient(87deg, #00aeff -43%, #6ed1ff 147.28%);
  border: none;
`;

const DirectUseButtonText = styled.div`
  color: white;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 600;
`;
