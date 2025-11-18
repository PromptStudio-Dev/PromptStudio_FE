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
import ChatBar from "../../components/ChatSection/ChatBar";

export default function HubPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hottestPrompts, setHottestPrompts] = useState([]);
  const [isHotLoading, setIsHotLoading] = useState(false);
  const [hotError, setHotError] = useState(null);
  const [categoryPrompts, setCategoryPrompts] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  const handlePromptDragStart = (event, promptData) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/json", JSON.stringify(promptData));

    // 새로운 프롬프트를 드래그하는 순간 ChatBar 입력 상태 초기화
    window.dispatchEvent(new Event("chatbar-reset"));

    // 드래그 이미지에 border-radius가 포함되도록 요소를 복제하여 사용
    const dragElement = event.currentTarget;
    if (dragElement) {
      const rect = dragElement.getBoundingClientRect();

      // 요소를 복제하여 모든 스타일(border-radius 포함)을 유지
      const dragImage = dragElement.cloneNode(true);

      // 복제된 요소에 원본의 모든 computed style 적용
      const computedStyle = window.getComputedStyle(dragElement);
      dragImage.style.cssText = computedStyle.cssText;
      dragImage.style.position = "absolute";
      dragImage.style.top = "-9999px";
      dragImage.style.left = "-9999px";
      dragImage.style.width = `${rect.width}px`;
      dragImage.style.height = `${rect.height}px`;
      dragImage.style.margin = "0";
      dragImage.style.transform = "none";
      dragImage.style.opacity = "1";

      // 드래그 중 원본 요소의 모서리가 보이지 않도록 임시로 숨김
      dragElement.style.opacity = "0";

      document.body.appendChild(dragImage);

      // 복제된 요소를 드래그 이미지로 사용 (border-radius 포함)
      event.dataTransfer.setDragImage(
        dragImage,
        rect.width / 2,
        rect.height / 2
      );

      // 드래그 이미지 설정 후 복제된 요소 제거
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }

    window.dispatchEvent(new Event("prompt-card-dragstart"));
  };

  const handlePromptDragEnd = (event) => {
    // 드래그 종료 시 원본 요소의 opacity 복원
    if (event?.currentTarget) {
      event.currentTarget.style.opacity = "1";
    }
    window.dispatchEvent(new Event("prompt-card-dragend"));
  };

  const buildPromptData = (prompt) => ({
    promptId: prompt.promptId,
    category: prompt.category ?? "미분류",
    aiName: prompt.aiEnvironment ?? "AI",
    title: prompt.title ?? "제목 미상",
    subtitle: prompt.introduction ?? "",
    backgroundImage: prompt.imageUrl || "",
  });

  const handleSearchInputChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      // 엔터키 입력 시 검색 쿼리 업데이트 (검색 실행)
      const trimmedValue = e.target.value.trim();
      setSearchQuery(trimmedValue);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchHottestPrompts = async () => {
      setIsHotLoading(true);
      setHotError(null);

      try {
        const { data } = await apiClient.get("/api/prompts/hot", {
          params: {
            memberId: 1,
            category: selectedCategory,
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
  }, [selectedCategory]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSearchPrompts = async () => {
      setIsCategoryLoading(true);
      setCategoryError(null);

      try {
        const { data } = await apiClient.get("/api/prompts/search", {
          params: {
            q: searchQuery.trim(),
            category: selectedCategory,
            memberId: 1,
          },
          signal: controller.signal,
        });

        console.log("검색 프롬프트 응답 데이터:", data);

        setCategoryPrompts(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("검색 결과를 불러오지 못했습니다.", fetchError);

        let errorMessage = "검색 결과를 불러오지 못했습니다.";
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

    const fetchCategoryPrompts = async () => {
      setIsCategoryLoading(true);
      setCategoryError(null);

      try {
        const { data } = await apiClient.get("/api/prompts", {
          params: {
            memberId: 1,
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

    // 검색어가 있으면 검색 API 호출, 없으면 카테고리 API 호출
    if (searchQuery.trim()) {
      fetchSearchPrompts();
    } else {
      fetchCategoryPrompts();
    }

    return () => {
      controller.abort();
    };
  }, [selectedCategory, searchQuery]);

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
          <SearchLabelLeft>PROMPT</SearchLabelLeft>
          <SearchBar>
            <SearchIcon src={SearchIconImg} />
            <SearchInput
              placeholder="프로의 프롬프트로 최고의 결과물을 사냥하세요"
              value={searchInputValue}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
            />
          </SearchBar>
          <SearchLabelRight>STUDIO</SearchLabelRight>
        </SearchSection>
        <CardSection>
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
          <HotSectionWrapper>
            <HottestPrompt>
              <HotImg src={HotIcon} alt="Hot prompt icon" />
              <HotText>지금 인기 있는 프롬프트</HotText>
            </HottestPrompt>
            <HotSection>
              <PromptCards>
                {isHotLoading ? (
                  <StatusMessage>
                    인기 프롬프트를 불러오는 중입니다.
                  </StatusMessage>
                ) : hotError ? (
                  <StatusMessage>{hotError}</StatusMessage>
                ) : hottestPreview.length === 0 ? (
                  <StatusMessage>
                    표시할 인기 프롬프트가 없습니다.
                  </StatusMessage>
                ) : (
                  hottestPreview.map((prompt) => {
                    const promptData = buildPromptData(prompt);
                    return (
                      <PromptCard
                        key={
                          prompt.promptId ??
                          `${prompt.title}-${prompt.memberId}`
                        }
                        {...promptData}
                        draggable
                        onDragStart={(event) =>
                          handlePromptDragStart(event, promptData)
                        }
                        onDragEnd={handlePromptDragEnd}
                      />
                    );
                  })
                )}
              </PromptCards>
            </HotSection>
          </HotSectionWrapper>

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
              categoryPrompts.map((prompt) => {
                const promptData = buildPromptData(prompt);
                return (
                  <PromptCard
                    key={
                      prompt.promptId ?? `${prompt.title}-${prompt.memberId}`
                    }
                    {...promptData}
                    draggable
                    onDragStart={(event) =>
                      handlePromptDragStart(event, promptData)
                    }
                    onDragEnd={handlePromptDragEnd}
                  />
                );
              })
            )}
          </PromptCards>
        </CardSection>
      </LeftSection>
      <RightSection>
        <ChatBar />
      </RightSection>
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

const HotSectionWrapper = styled.div`
  position: relative;
  margin-bottom: 1.19rem;
  margin-left: -1.44rem;
  margin-right: -1.44rem;
  margin-top: calc(15rem * 43 / 239 / 2);
`;

const HotSection = styled.div`
  border-radius: 1.25rem;
  border: 1px solid #9eeaff;
  padding-top: 2rem;
  padding-left: 1.44rem;
  padding-right: 1.44rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HottestPrompt = styled.div`
  width: 15rem;
  aspect-ratio: 239 / 43;
  position: absolute;
  top: calc(-15rem * 43 / 239 / 2);
  left: 1.44rem;
  background: #00c8ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10rem;
  z-index: 2;
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
  width: 100%;
  flex: 1;
  min-height: 0;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10%;
  padding-bottom: 6rem;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  height: fit-content;
  margin-top: 0;
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
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem 2rem;
  width: 100%;
  align-content: flex-start;
`;

const SearchIcon = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
  margin-left: 2.5rem;
  margin-bottom: 0.2rem;
`;
const MainSection = styled.div`
  display: flex;
  height: 100%;
  font-family: "Pretendard Variable", sans-serif;
  overflow: hidden;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 36%;
  height: 3.3125rem;
  border-radius: 7.5rem;
  border: 0.0625rem solid var(--Light-blue, #49d8ff);
  background: #fff;
  position: relative;
  z-index: 2;
`;

const SearchLabel = styled.span`
  display: flex;
  align-items: center;
  height: 3.3125rem;
  padding-top: 0.4rem;
  color: var(--Light-blue, #49d8ff);
  font-family: "Instrument Sans", sans-serif;
  font-size: 3.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.07rem;
  z-index: 1;
`;

const SearchLabelLeft = styled(SearchLabel)`
  margin-right: -1rem;
`;

const SearchLabelRight = styled(SearchLabel)`
  margin-left: -1rem;
`;

const LeftSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 67vw;
  height: 100%;
  max-height: 100%;
  background-color: #fff;
  overflow: hidden;
`;

const SearchSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 12vh;
  flex-shrink: 0;
  background: none;
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
