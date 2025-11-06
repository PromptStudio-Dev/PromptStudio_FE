import React, { useState } from "react";
import styled from "styled-components";
import SearchIconImg from "./assets/searchIcon.svg";
import HotIcon from "./assets/hotIcon.svg";
import businessIcon from "./assets/businessIcon.svg";
import employeeIcon from "./assets/employeeIcon.svg";
import investIcon from "./assets/investIcon.svg";
import designIcon from "./assets/designIcon.svg";
import normalIcon from "./assets/normalIcon.svg";
import studyIcon from "./assets/studyIcon.svg";
import PromptCard from "./PromptCard";
import CategoryTag from "./CategoryTag";

export default function HubPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = [
    { name: "전체", img: "" },
    { name: "비즈니스", img: businessIcon },
    { name: "취업", img: employeeIcon },
    { name: "개발", img: investIcon },
    { name: "디자인", img: designIcon },
    { name: "일상", img: normalIcon },
    { name: "학업", img: studyIcon },
  ];

  const promptCards = [
    {
      category: "비즈니스",
      aiName: "PromptAI",
      title: "시장 분석 보고서",
      subtitle: "신규 제품 런칭 준비를 위한 시장 규모와 경쟁사 분석 프롬프트",
    },
    {
      category: "교육",
      aiName: "TutorBot",
      title: "개념 정리 프롬프트",
      subtitle: "고등학생 미적분 핵심 개념을 이해하기 쉽게 정리하는 프롬프트",
    },
    {
      category: "디자인",
      aiName: "DesignGen",
      title: "브랜드 무드보드",
      subtitle: "톤앤매너가 통일된 무드보드를 빠르게 생성하는 프롬프트",
    },
  ];

  return (
    <MainSection>
      <LeftSection>
        <SearchSection>
          <SearchBar>
            <SearchIcon src={SearchIconImg} />
            <SearchInput placeholder="프로의 프롬프트로 최고의 결과물을 사냥하세요" />
          </SearchBar>
        </SearchSection>
        <CardSection>
          <HottestPrompt>
            <HotImg src={HotIcon} alt="Hot prompt icon" />
            <HotText>지금 인기 있는 프롬프트</HotText>
          </HottestPrompt>
          <PromptCards>
            {promptCards.map((card) => (
              <PromptCard
                key={card.title}
                category={card.category}
                aiName={card.aiName}
                title={card.title}
                subtitle={card.subtitle}
              />
            ))}
          </PromptCards>
          <CategoryList>
            {categories.map((category) => (
              <CategoryTag
                key={category.name}
                name={category.name}
                img={category.img}
                isSelected={selectedCategory === category.name}
                onClick={() => setSelectedCategory(category.name)}
              />
            ))}
          </CategoryList>
          <PromptCards>
            {promptCards.map((card) => (
              <PromptCard
                key={card.title}
                category={card.category}
                aiName={card.aiName}
                title={card.title}
                subtitle={card.subtitle}
              />
            ))}
          </PromptCards>
        </CardSection>
      </LeftSection>
      <RightSection></RightSection>
    </MainSection>
  );
}

const HotImg = styled.img`
  width: 1.4375rem;
  height: 1.4375rem;
  margin-right: 0.62rem;
`;

const HotText = styled.p`
  color: #fff;
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const HottestPrompt = styled.div`
  width: 15rem;
  aspect-ratio: 239 / 43;
  margin-top: 2.38rem;
  margin-bottom: 1rem;
  background: #00c8ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10rem;
`;

const SearchInput = styled.input`
  width: 80%;
  margin-left: 1.69rem;
  border: none;
  font-size: 1.25rem;
  outline: none;

  &:focus {
    outline: none;
  }
`;

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 83.4%;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.8rem;
  margin-bottom: 1.69rem;
`;

const PromptCards = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 1.5rem;
  width: 100%;
`;

const SearchIcon = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
  margin-left: 2.5rem;
  margin-bottom: 0.2rem;
`;
const MainSection = styled.div`
  display: flex;
  font-family: "Pretendard Variable", sans-serif;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  height: 40%;
  border-radius: 7.5rem;
  border: 0.0625rem solid var(--Light-blue, #49d8ff);
  background: #fff;
`;

const LeftSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 67vw;
  height: 100vh;
  background-color: #fff;
`;

const SearchSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 16.6%;
  background-color: #f1f1f1;
`;

const RightSection = styled.section`
  width: 33vw;
  height: 100vh;
  background: #f1f1f1;
`;
