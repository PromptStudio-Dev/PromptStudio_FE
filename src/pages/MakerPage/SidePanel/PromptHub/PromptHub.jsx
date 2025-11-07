import React, { useState } from "react";
import styled from "styled-components";
import PromptCardList from "./PromptCardList";
import PromptSectionDetail from "./PromptSectionDetail";

export default function PromptHub() {
  const [currentView, setCurrentView] = useState("main"); // "main" | "detail"
  const [selectedSection, setSelectedSection] = useState(null);

  // 임시 mock 데이터 (나중에 API 연동 시 교체)

  // 현재 최근 본 프롬프트, 안기 프롬프트만 정렬 (api)
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

  const handleMoreClick = (sectionName, prompts) => {
    setSelectedSection({ title: sectionName, prompts });
    setCurrentView("detail");
  };

  const handleBack = () => {
    setCurrentView("main");
    setSelectedSection(null);
  };

  // 상세 뷰 렌더링
  if (currentView === "detail" && selectedSection) {
    return (
      <PromptSectionDetail
        sectionTitle={selectedSection.title}
        prompts={selectedSection.prompts}
        onCardClick={handleCardClick}
        onBack={handleBack}
      />
    );
  }

  // 메인 뷰 렌더링
  return (
    <Wrapper>
      <ContentArea>
        {/* 최근 본 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>최근 본 프롬프트</SectionTitle>
            <ViewAllButton
              onClick={() => handleMoreClick("최근 본 프롬프트", recentPrompts)}
            >
              더보기
            </ViewAllButton>
          </SectionHeader>
          <PromptCardList
            prompts={recentPrompts}
            onCardClick={handleCardClick}
          />
        </Section>

        {/* 인기 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>인기 프롬프트</SectionTitle>
            <ViewAllButton
              onClick={() => handleMoreClick("인기 프롬프트", popularPrompts)}
            >
              더보기
            </ViewAllButton>
          </SectionHeader>
          <PromptCardList
            prompts={popularPrompts}
            onCardClick={handleCardClick}
          />
        </Section>

        {/* 추천 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>추천 프롬프트</SectionTitle>
            <ViewAllButton
              onClick={() => handleMoreClick("추천 프롬프트", recommendPrompts)}
            >
              더보기
            </ViewAllButton>
          </SectionHeader>
          <PromptCardList
            prompts={recommendPrompts}
            onCardClick={handleCardClick}
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.375rem; /* 22px */
  font-weight: 600;
  line-height: normal;
  color: #000000;
  margin: 0;
`;

const ViewAllButton = styled.button`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem; /* 14px */
  font-weight: 500;
  color: #454545;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  transition: color 0.2s ease;

  &:hover {
    color: #000000;
  }
`;
