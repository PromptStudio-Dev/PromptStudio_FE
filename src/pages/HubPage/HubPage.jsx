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
import { useNavigate } from "react-router-dom";

// TODO: 서버 설정 완료 후 이 플래그를 false로 변경하거나 삭제하세요
const USE_DUMMY_DATA = false;

// 더미 데이터
const DUMMY_HOTTEST_PROMPTS = [
  {
    promptId: 1,
    title: "비즈니스 이메일 작성 가이드",
    introduction:
      "전문적이고 효과적인 비즈니스 이메일을 작성하는 방법을 알려드립니다.",
    category: "비즈니스",
    aiEnvironment: "ChatGPT",
    imageUrl: "",
    liked: false,
    memberId: 1,
  },
  {
    promptId: 2,
    title: "면접 준비 완벽 가이드",
    introduction:
      "취업 면접에서 자주 나오는 질문과 모범 답변을 준비할 수 있습니다.",
    category: "취업",
    aiEnvironment: "Claude",
    imageUrl: "",
    liked: true,
    memberId: 1,
  },
  {
    promptId: 3,
    title: "React 컴포넌트 최적화",
    introduction:
      "React 애플리케이션의 성능을 향상시키는 컴포넌트 최적화 기법을 학습합니다.",
    category: "개발",
    aiEnvironment: "GPT-4",
    imageUrl: "",
    liked: false,
    memberId: 1,
  },
];

const DUMMY_CATEGORY_PROMPTS = [
  {
    promptId: 4,
    title: "프로젝트 관리 마스터",
    introduction:
      "효과적인 프로젝트 관리를 위한 체계적인 접근 방법을 제시합니다.",
    category: "비즈니스",
    aiEnvironment: "ChatGPT",
    imageUrl: "",
    liked: false,
    memberId: 1,
  },
  {
    promptId: 5,
    title: "포트폴리오 제작 가이드",
    introduction: "디자이너를 위한 포트폴리오 제작의 모든 것을 담았습니다.",
    category: "디자인",
    aiEnvironment: "Midjourney",
    imageUrl: "",
    liked: true,
    memberId: 1,
  },
  {
    promptId: 6,
    title: "제목도 길게제목도 길게제목도 길게제목도 길게제목도 길게제목도 길게",
    introduction:
      "실생활에서 바로 쓸 수 있는 영어 회화 표현을 배워봅시다.길게길게길게길게길게길게길게길게",
    category: "일상",
    aiEnvironment: "ChatGPT",
    imageUrl: "",
    liked: false,
    memberId: 1,
  },
  {
    promptId: 7,
    title: "논문 작성 도우미",
    introduction: "학술 논문 작성에 필요한 구조와 작성 방법을 안내합니다.",
    category: "학업",
    aiEnvironment: "Claude",
    imageUrl: "",
    liked: false,
    memberId: 1,
  },
  {
    promptId: 8,
    title: "스타트업 아이디어 검증",
    introduction:
      "비즈니스 아이디어의 타당성을 검증하고 개선하는 방법을 알아봅니다.",
    category: "비즈니스",
    aiEnvironment: "GPT-4",
    imageUrl: "",
    liked: true,
    memberId: 1,
  },
  {
    promptId: 9,
    title: "UI/UX 디자인 원칙",
    introduction:
      "사용자 경험을 향상시키는 디자인 원칙과 실전 팁을 제공합니다.",
    category: "디자인",
    aiEnvironment: "Figma",
    imageUrl: "",
    liked: false,
    memberId: 1,
  },
];

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
  const navigate = useNavigate();

  const handlePromptDragStart = (event, promptData) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/json", JSON.stringify(promptData));

    // 새로운 프롬프트를 드래그하는 순간 ChatBar 입력 상태 초기화
    window.dispatchEvent(new Event("chatbar-reset"));

    // 드래그 이미지에 border-radius가 포함되도록 요소를 복제하여 사용
    const dragElement = event.currentTarget;
    if (dragElement) {
      const rect = dragElement.getBoundingClientRect();
      const dragImage = dragElement.cloneNode(true);

      const computedStyle = window.getComputedStyle(dragElement);
      dragImage.style.cssText = computedStyle.cssText;
      dragImage.style.position = "absolute";
      dragImage.style.top = "-9999px";
      dragImage.style.left = "-9999px";
      dragImage.style.width = `${rect.width}px`;
      dragImage.style.height = `${rect.height}px`;
      dragImage.style.boxSizing = "border-box";
      dragImage.style.setProperty("width", `${rect.width}px`, "important");
      dragImage.style.setProperty("height", `${rect.height}px`, "important");
      dragImage.style.maxWidth = "none";
      dragImage.style.maxHeight = "none";
      dragImage.style.minWidth = "0";
      dragImage.style.minHeight = "0";
      dragImage.style.margin = "0";
      dragImage.style.transformOrigin = "top left";
      dragImage.style.transform = "none";
      dragImage.style.opacity = "1";

      dragElement.style.opacity = "0";
      document.body.appendChild(dragImage);

      event.dataTransfer.setDragImage(
        dragImage,
        rect.width / 2,
        rect.height / 2
      );

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
    initialLiked: prompt.liked || false,
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

      // 더미 데이터 사용 모드
      if (USE_DUMMY_DATA) {
        setTimeout(() => {
          setHottestPrompts(DUMMY_HOTTEST_PROMPTS);
          setIsHotLoading(false);
        }, 500); // 로딩 효과를 위한 지연
        return;
      }

      try {
        const { data } = await apiClient.get("/api/prompts/hot", {
          params: {
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

        // 에러 발생 시 더미 데이터 사용
        if (USE_DUMMY_DATA) {
          setHottestPrompts(DUMMY_HOTTEST_PROMPTS);
          setIsHotLoading(false);
          return;
        }

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

      // 더미 데이터 사용 모드
      if (USE_DUMMY_DATA) {
        setTimeout(() => {
          // 검색어에 따라 필터링된 더미 데이터 반환
          const filtered = DUMMY_CATEGORY_PROMPTS.filter(
            (prompt) =>
              prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              prompt.introduction
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
          setCategoryPrompts(
            filtered.length > 0 ? filtered : DUMMY_CATEGORY_PROMPTS
          );
          setIsCategoryLoading(false);
        }, 500);
        return;
      }

      try {
        const { data } = await apiClient.get("/api/prompts/search", {
          params: {
            q: searchQuery.trim(),
            category: selectedCategory,
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

        // 에러 발생 시 더미 데이터 사용
        if (USE_DUMMY_DATA) {
          const filtered = DUMMY_CATEGORY_PROMPTS.filter(
            (prompt) =>
              prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              prompt.introduction
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
          setCategoryPrompts(
            filtered.length > 0 ? filtered : DUMMY_CATEGORY_PROMPTS
          );
          setIsCategoryLoading(false);
          return;
        }

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

      // 더미 데이터 사용 모드
      if (USE_DUMMY_DATA) {
        setTimeout(() => {
          // 선택된 카테고리에 따라 필터링된 더미 데이터 반환
          const filtered =
            selectedCategory === "전체"
              ? DUMMY_CATEGORY_PROMPTS
              : DUMMY_CATEGORY_PROMPTS.filter(
                  (prompt) => prompt.category === selectedCategory
                );
          setCategoryPrompts(filtered);
          setIsCategoryLoading(false);
        }, 500);
        return;
      }

      try {
        const { data } = await apiClient.get("/api/prompts", {
          params: {
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

        // 에러 발생 시 더미 데이터 사용
        if (USE_DUMMY_DATA) {
          const filtered =
            selectedCategory === "전체"
              ? DUMMY_CATEGORY_PROMPTS
              : DUMMY_CATEGORY_PROMPTS.filter(
                  (prompt) => prompt.category === selectedCategory
                );
          setCategoryPrompts(filtered);
          setIsCategoryLoading(false);
          return;
        }

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

  const handlePromptCardClick = (promptId) => {
    navigate(`/prompt/${promptId}`);
  };

  const handleHeartToggle = (promptId, liked) => {
    setHottestPrompts((prev) =>
      prev.map((p) =>
        p.promptId === promptId ? { ...p, liked } : p
      )
    );
    setCategoryPrompts((prev) =>
      prev.map((p) =>
        p.promptId === promptId ? { ...p, liked } : p
      )
    );
  };

  return (
    <MainSection>
      <LeftSection>
        <SearchSection>
          <SearchLabelLeft>PROMPT</SearchLabelLeft>
          <SearchBar>
            <SearchIcon src={SearchIconImg} />
            <SearchInput
              placeholder="고퀄리티 프롬프트로 바로 뛰어 들어보세요!"
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
                        onClick={() => handlePromptCardClick(prompt.promptId)}
                        onHeartToggle={handleHeartToggle}
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
                    onClick={() => handlePromptCardClick(prompt.promptId)}
                    onHeartToggle={handleHeartToggle}
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
  padding: 0.4375rem 0.8125rem;
  width: fit-content;
  position: absolute;
  top: 0;
  left: 1.44rem;
  background: #00c8ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10rem;
  z-index: 2;
  transform: translateY(-50%);
`;

const HotImg = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
  margin-right: 0.62rem;
`;

const HotText = styled.p`
  color: #fff;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const SearchInput = styled.input`
  width: 75%;
  margin-left: 1.5rem;
  margin-right: 2.38rem;
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

  @media (max-width: 1600px) {
    padding: 0 10%;
  }

  @media (max-width: 1440px) {
    padding: 0 10%;
  }

  @media (max-width: 1024px) {
    padding: 0 3%;
  }
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

  @media (max-width: 1600px) {
    gap: 0.75rem 1rem;
  }
`;

const SearchIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 2.38rem;
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
  width: 30.4375rem;
  height: 3.3125rem;
  border-radius: 7.5rem;
  border: 3px solid var(--Light-blue, #49D8FF);
  background: #fff;
  position: relative;
  z-index: 2;
`;

const SearchLabel = styled.span`
  display: flex;
  align-items: center;
  height: 3.3125rem;
  // padding-top: 0.4rem;
  color: #E0F5FF;
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
