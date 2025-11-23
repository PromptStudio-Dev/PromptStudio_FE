import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ChatBar from "../../components/ChatSection/ChatBar";
import apiClient from "../../api/client";
import heartIcon from "./assets/detailLikeIcon.svg";

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
