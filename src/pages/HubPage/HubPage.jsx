import React, { useEffect, useState } from "react";
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
import apiClient from "../../api/client";

export default function HubPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [hottestPrompts, setHottestPrompts] = useState([]);
  const [isHotLoading, setIsHotLoading] = useState(false);
  const [hotError, setHotError] = useState(null);
  const [categoryPrompts, setCategoryPrompts] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHottestPrompts = async () => {
      setIsHotLoading(true);
      setHotError(null);

      try {
        const { data } = await apiClient.get("/api/prompts/hot", {
          params: {
            memberId: 0,
            category: "전체",
          },
          signal: controller.signal,
        });

        console.log("인기 프롬프트 응답 데이터:", data);

        setHottestPrompts(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("인기 프롬프트를 불러오지 못했습니다.", fetchError);

        // 에러 타입에 따른 메시지 설정
        let errorMessage = "인기 프롬프트를 불러오지 못했습니다.";
        if (
          fetchError?.code === "ERR_NAME_NOT_RESOLVED" ||
          fetchError?.message?.includes("ERR_NAME_NOT_RESOLVED")
        ) {
          errorMessage =
            "서버에 연결할 수 없습니다. 서버가 준비되었는지 확인해주세요.";
        } else if (fetchError?.response) {
          errorMessage = `서버 오류: ${fetchError.response.status}`;
        } else if (fetchError?.request) {
          errorMessage = "서버로부터 응답을 받지 못했습니다.";
        }

        setHotError(errorMessage);
      } finally {
        setIsHotLoading(false);
      }
    };

    fetchHottestPrompts();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategoryPrompts = async () => {
      setIsCategoryLoading(true);
      setCategoryError(null);

      try {
        const { data } = await apiClient.get("/api/prompts", {
          params: {
            memberId: 0,
            category: selectedCategory,
          },
          signal: controller.signal,
        });

        console.log("카테고리 프롬프트 응답 데이터:", data);

        setCategoryPrompts(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("프롬프트 목록을 불러오지 못했습니다.", fetchError);

        let errorMessage = "프롬프트 목록을 불러오지 못했습니다.";
        if (
          fetchError?.code === "ERR_NAME_NOT_RESOLVED" ||
          fetchError?.message?.includes("ERR_NAME_NOT_RESOLVED")
        ) {
          errorMessage =
            "서버에 연결할 수 없습니다. 서버가 준비되었는지 확인해주세요.";
        } else if (fetchError?.response) {
          errorMessage = `서버 오류: ${fetchError.response.status}`;
        } else if (fetchError?.request) {
          errorMessage = "서버로부터 응답을 받지 못했습니다.";
        }

        setCategoryError(errorMessage);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategoryPrompts();

    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

  const categories = [
    { name: "전체", img: "" },
    { name: "비즈니스", img: businessIcon },
    { name: "취업", img: employeeIcon },
    { name: "개발", img: investIcon },
    { name: "디자인", img: designIcon },
    { name: "일상", img: normalIcon },
    { name: "학업", img: studyIcon },
  ];

  const hottestPreview = hottestPrompts.slice(0, 3);

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
            {isHotLoading ? (
              <StatusMessage>인기 프롬프트를 불러오는 중입니다.</StatusMessage>
            ) : hotError ? (
              <StatusMessage>{hotError}</StatusMessage>
            ) : hottestPreview.length === 0 ? (
              <StatusMessage>표시할 인기 프롬프트가 없습니다.</StatusMessage>
            ) : (
              hottestPreview.map((prompt) => (
                <PromptCard
                  key={prompt.promptId ?? `${prompt.title}-${prompt.memberId}`}
                  category={prompt.category ?? "미분류"}
                  aiName={prompt.aiEnvironment ?? "AI"}
                  title={prompt.title ?? "제목 미상"}
                  subtitle={prompt.introduction ?? ""}
                />
              ))
            )}
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
            {isCategoryLoading ? (
              <StatusMessage>프롬프트를 불러오는 중입니다.</StatusMessage>
            ) : categoryError ? (
              <StatusMessage>{categoryError}</StatusMessage>
            ) : categoryPrompts.length === 0 ? (
              <StatusMessage>
                선택한 카테고리의 프롬프트가 없습니다.
              </StatusMessage>
            ) : (
              categoryPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.promptId ?? `${prompt.title}-${prompt.memberId}`}
                  category={prompt.category ?? "미분류"}
                  aiName={prompt.aiEnvironment ?? "AI"}
                  title={prompt.title ?? "제목 미상"}
                  subtitle={prompt.introduction ?? ""}
                />
              ))
            )}
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

const StatusMessage = styled.p`
  width: 100%;
  text-align: center;
  padding: 1.5rem 0;
  color: #7a7a7a;
  font-size: 1rem;
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
