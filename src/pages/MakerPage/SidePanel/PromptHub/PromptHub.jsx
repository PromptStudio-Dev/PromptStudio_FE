import React, { useState } from "react";
import styled from "styled-components";
import PromptCardList from "./PromptCardList";

export default function PromptHub() {
  // 임시 mock 데이터 (나중에 API 연동 시 교체)
  const [recentPrompts, setRecentPrompts] = useState([
    {
      id: 1,
      category: "디자인",
      aiName: "ChatGPT",
      title: "로고 디자인 프롬프트",
      subtitle: "전문적인 로고를 만들기 위한 상세한 프롬프트입니다.",
      backgroundImage: "",
    },
    {
      id: 2,
      category: "코딩",
      aiName: "Claude",
      title: "React 컴포넌트 생성",
      subtitle: "재사용 가능한 React 컴포넌트를 만드는 프롬프트",
      backgroundImage: "",
    },
    {
      id: 3,
      category: "디자인",
      aiName: "ChatGPT",
      title: "로고 디자인 프롬프트",
      subtitle: "전문적인 로고를 만들기 위한 상세한 프롬프트입니다.",
      backgroundImage: "",
    },
  ]);

  const [popularPrompts, setPopularPrompts] = useState([
    {
      id: 3,
      category: "마케팅",
      aiName: "ChatGPT",
      title: "SNS 콘텐츠 작성",
      subtitle: "효과적인 SNS 마케팅 콘텐츠를 만드는 프롬프트",
      backgroundImage: "",
    },
    {
      id: 4,
      category: "비즈니스",
      aiName: "Claude",
      title: "이메일 작성",
      subtitle: "전문적인 비즈니스 이메일 작성 프롬프트",
      backgroundImage: "",
    },
  ]);

  const [recommendPrompts, setRecommendPrompts] = useState([
    {
      id: 5,
      category: "분석",
      aiName: "Claude",
      title: "데이터 분석 요청",
      subtitle: "복잡한 데이터를 분석하고 인사이트를 도출하는 프롬프트",
      backgroundImage: "",
    },
    {
      id: 6,
      category: "창작",
      aiName: "ChatGPT",
      title: "스토리 작성",
      subtitle: "창의적인 스토리를 만드는 프롬프트",
      backgroundImage: "",
    },
  ]);

  const handleCardClick = (promptId) => {
    console.log("카드 클릭:", promptId);
    // 나중에 카드 클릭 시 동작 구현
  };

  const handleMoreClick = (sectionName) => {
    console.log(`${sectionName} 더보기 클릭`);
    // 나중에 더보기 버튼 클릭 시 동작 구현
  };

  return (
    <Wrapper>
      <ContentArea>
        {/* 최근 본 섹션 */}
        <Section>
          <SectionTitle>최근 본 프롬프트</SectionTitle>
          <PromptCardList
            prompts={recentPrompts}
            onCardClick={handleCardClick}
            onMoreClick={() => handleMoreClick("최근 본 프롬프트")}
          />
        </Section>

        {/* 인기 섹션 */}
        <Section>
          <SectionTitle>인기 프롬프트</SectionTitle>
          <PromptCardList
            prompts={popularPrompts}
            onCardClick={handleCardClick}
            onMoreClick={() => handleMoreClick("인기 프롬프트")}
          />
        </Section>

        {/* 추천 섹션 */}
        <Section>
          <SectionTitle>추천 프롬프트</SectionTitle>
          <PromptCardList
            prompts={recommendPrompts}
            onCardClick={handleCardClick}
            onMoreClick={() => handleMoreClick("추천 프롬프트")}
          />
        </Section>
      </ContentArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem 0 2rem 1.77vw;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.375rem; /* 22px */
  font-weight: 600;
  line-height: normal;
  color: #000000;
  margin: 0 0 1rem 0;
`;
