import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PromptCardList from "./PromptCardList";
import PromptSectionDetail from "./PromptSectionDetail";
import PromptCard from "./PromptCard";
import backButtonIcon from "../../assets/side-panel-close.svg";
import apiClient from "../../../../api/client";

export default function PromptHub({ searchKeyword = "", onClearSearch }) {
  const [currentView, setCurrentView] = useState("main"); // "main" | "detail"
  const [selectedSection, setSelectedSection] = useState(null);

  // 로딩 및 에러
  const [isAllLoading, setIsAllLoading] = useState(false);
  const [allError, setAllError] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // 인기 프롬프트 상태
  const [popularPrompts, setPopularPrompts] = useState([]);
  const [isPopularLoading, setIsPopularLoading] = useState(false);
  const [popularError, setPopularError] = useState(null);

  // 최근 본 프롬프트 상태
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [isRecentLoading, setIsRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState(null);

  // 추천 프롬프트 (임시 - 나중에 API 연동)
  const [recommendPrompts, setRecommendPrompts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchKeyword) {
      setCurrentView("main");
      setSelectedSection(null);
    }
  }, [searchKeyword]);

  // 최근 조회한 프롬프트 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchRecentPrompts = async () => {
      setIsRecentLoading(true);
      setRecentError(null);

      try {
        const memberId = 1; // TODO: 실제 로그인한 사용자 ID로 교체
        const { data } = await apiClient.get(
          `/api/prompts/recent/members/${memberId}`,
          {
            signal: controller.signal,
          }
        );

        console.log("최근 조회한 프롬프트 응답 데이터:", data);

        const formattedPrompts = Array.isArray(data) ? data : [];

        setRecentPrompts(formattedPrompts);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error(
          "최근 조회한 프롬프트를 불러오지 못했습니다.",
          fetchError
        );

        let errorMessage = "최근 조회한 프롬프트를 불러오지 못했습니다.";
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

        setRecentError(errorMessage);
      } finally {
        setIsRecentLoading(false);
      }
    };

    fetchRecentPrompts();

    return () => {
      controller.abort();
    };
  }, []);

  // 인기 프롬프트 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchPopularPrompts = async () => {
      setIsPopularLoading(true);
      setPopularError(null);

      try {
        const { data } = await apiClient.get("/api/prompts/hot", {
          params: {
            memberId: 1,
            category: "전체",
          },
          signal: controller.signal,
        });

        console.log("인기 프롬프트 응답 데이터:", data);

        // API 응답을 컴포넌트에서 사용하는 형식으로 변환
        const formattedPrompts = Array.isArray(data) ? data : [];

        setPopularPrompts(formattedPrompts);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("인기 프롬프트를 불러오지 못했습니다.", fetchError);

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

        setPopularError(errorMessage);
      } finally {
        setIsPopularLoading(false);
      }
    };

    fetchPopularPrompts();

    return () => {
      controller.abort();
    };
  }, []);

  // 전체 프롬프트 조회
  // (추천용 api 연동이 되어 있지 않아, 전체 프롬프트 조회로 진행)
  useEffect(() => {
    const controller = new AbortController();

    const fetchAllPrompts = async () => {
      setIsAllLoading(true);
      setAllError(null);

      try {
        const { data } = await apiClient.get("/api/prompts", {
          params: {
            memberId: 1,
            category: "전체",
          },
          signal: controller.signal,
        });

        console.log("전체 프롬프트 응답 데이터:", data);

        const formattedPrompts = Array.isArray(data) ? data : [];

        setRecommendPrompts(formattedPrompts.slice(0, 6));
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("전체 프롬프트를 불러오지 못했습니다.", fetchError);

        let errorMessage = "프롬프트를 불러오지 못했습니다.";
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

        setAllError(errorMessage);
        setRecommendPrompts([]);
      } finally {
        setIsAllLoading(false);
      }
    };

    fetchAllPrompts();

    return () => {
      controller.abort();
    };
  }, []);

  // 검색 프롬프트 조회
  // AI 검색으로, 30개 이하면 전체보기로 보임 - query 의미 없음(현재)
  useEffect(() => {
    const trimmedKeyword = searchKeyword.trim();

    if (trimmedKeyword === "") {
      setSearchResults([]);
      setSearchError(null);
      setIsSearchLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchSearchResults = async () => {
      setIsSearchLoading(true);
      setSearchError(null);

      try {
        const { data } = await apiClient.get("/api/prompts/search", {
          params: {
            memberId: 1,
            category: "전체",
            q: trimmedKeyword,
            query: trimmedKeyword,
          },
          signal: controller.signal,
        });

        console.log("프롬프트 검색 결과:", data);

        const formattedPrompts = Array.isArray(data) ? data : [];

        setSearchResults(formattedPrompts);
      } catch (fetchError) {
        // 에러 처리 로직
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("프롬프트 검색에 실패했습니다.", fetchError);

        let errorMessage = "프롬프트 검색에 실패했습니다.";
        if (
          fetchError?.code === "ERR_NAME_NOT_RESOLVED" ||
          fetchError?.message?.includes("ERR_NAME_NOT_RESOLVED")
        ) {
          errorMessage =
            "서버에 연결할 수 없습니다. 서버가 준비되었는지 확인해주세요.";
        } else if (fetchError?.response) {
          if (fetchError.response.status === 404) {
            errorMessage = "검색 결과가 없습니다.";
          } else {
            errorMessage = `서버 오류: ${fetchError.response.status}`;
          }
        } else if (fetchError?.request) {
          errorMessage = "서버로부터 응답을 받지 못했습니다.";
        }

        setSearchError(errorMessage);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    };

    fetchSearchResults();

    return () => {
      controller.abort();
    };
  }, [searchKeyword]);

  // 카드 클릭 시 동작 (프롬프트 상세 보기 페이지 UI 없어서 API 호출만 진행 - 최근 정렬 위해서)
  // 프롬프트 상세보기 API
  const handleCardClick = async (promptId) => {
    console.log("카드 클릭:", promptId);

    try {
      const { data } = await apiClient.get(`/api/prompts/${promptId}`, {
        params: {
          memberId: 1,
        },
      });

      console.log("프롬프트 상세 응답 데이터:", data);

      const formattedPrompt = {
        promptId: data.promptId,
        category: data.category ?? "미분류",
        aiEnvironment: data.aiEnvironment ?? "AI",
        title: data.title ?? "제목 미상",
        introduction: data.introduction ?? data.content ?? "",
        imageUrl: data.imageUrl ?? "",
      };

      setRecentPrompts((prev) => {
        const filtered = prev.filter(
          (prompt) =>
            (prompt.id ?? prompt.promptId) !==
            (formattedPrompt.id ?? formattedPrompt.promptId)
        );
        return [formattedPrompt, ...filtered];
      });
    } catch (error) {
      console.error("프롬프트 상세 조회에 실패했습니다.", error);
    }
  };

  // 카드 리스트 더보기 버튼 클릭 시 동작
  const handleMoreClick = (sectionName, prompts) => {
    setSelectedSection({ title: sectionName, prompts });
    setCurrentView("detail");
  };

  // 카드 리스트 이전 버튼 클릭 시 동작
  const handleBack = () => {
    setCurrentView("main");
    setSelectedSection(null);
  };

  const hasActiveSearch = searchKeyword.trim() !== "";

  // 상세 뷰 렌더링 (프롬프트 더보기 시)
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

  if (hasActiveSearch) {
    return (
      <SearchWrapper>
        <SearchHeader>
          <BackButton onClick={onClearSearch}>
            <img src={backButtonIcon} alt="뒤로" />
          </BackButton>
          <SearchTitle>{`"${searchKeyword}" 검색 결과`}</SearchTitle>
        </SearchHeader>
        <SearchContent>
          {isSearchLoading ? (
            <SearchStatusMessage>
              프롬프트를 검색 중입니다...
            </SearchStatusMessage>
          ) : searchError ? (
            <SearchStatusMessage>{searchError}</SearchStatusMessage>
          ) : searchResults.length === 0 ? (
            <SearchStatusMessage>검색 결과가 없습니다.</SearchStatusMessage>
          ) : (
            <SearchCardList>
              {searchResults.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  category={prompt.category}
                  aiName={prompt.aiName}
                  title={prompt.title}
                  subtitle={prompt.introduction}
                  backgroundImage={prompt.imageUrl}
                  onClick={() => handleCardClick(prompt.id)}
                />
              ))}
            </SearchCardList>
          )}
        </SearchContent>
      </SearchWrapper>
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
            {!isRecentLoading && recentPrompts.length > 0 && (
              <ViewAllButton
                onClick={() =>
                  handleMoreClick("최근 본 프롬프트", recentPrompts)
                }
              >
                더보기
              </ViewAllButton>
            )}
          </SectionHeader>
          {isRecentLoading ? (
            <StatusMessage>
              최근 본 프롬프트를 불러오는 중입니다...
            </StatusMessage>
          ) : recentError ? (
            <StatusMessage>{recentError}</StatusMessage>
          ) : recentPrompts.length === 0 ? (
            <StatusMessage>최근 본 프롬프트가 없습니다.</StatusMessage>
          ) : (
            <PromptCardList
              prompts={recentPrompts.slice(0, 3)}
              onCardClick={handleCardClick}
            />
          )}
        </Section>

        {/* 인기 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>인기 프롬프트</SectionTitle>
            {!isPopularLoading && popularPrompts.length > 0 && (
              <ViewAllButton
                onClick={() => handleMoreClick("인기 프롬프트", popularPrompts)}
              >
                더보기
              </ViewAllButton>
            )}
          </SectionHeader>
          {isPopularLoading ? (
            <StatusMessage>인기 프롬프트를 불러오는 중입니다...</StatusMessage>
          ) : popularError ? (
            <StatusMessage>{popularError}</StatusMessage>
          ) : popularPrompts.length === 0 ? (
            <StatusMessage>표시할 인기 프롬프트가 없습니다.</StatusMessage>
          ) : (
            <PromptCardList
              prompts={popularPrompts.slice(0, 3)}
              onCardClick={handleCardClick}
            />
          )}
        </Section>

        {/* 추천 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>추천 프롬프트</SectionTitle>
            {!isAllLoading && recommendPrompts.length > 0 && (
              <ViewAllButton
                onClick={() =>
                  handleMoreClick("추천 프롬프트", recommendPrompts)
                }
              >
                더보기
              </ViewAllButton>
            )}
          </SectionHeader>
          {isAllLoading ? (
            <StatusMessage>추천 프롬프트를 불러오는 중입니다...</StatusMessage>
          ) : allError ? (
            <StatusMessage>{allError}</StatusMessage>
          ) : recommendPrompts.length === 0 ? (
            <StatusMessage>표시할 추천 프롬프트가 없습니다.</StatusMessage>
          ) : (
            <PromptCardList
              prompts={recommendPrompts.slice(0, 3)}
              onCardClick={handleCardClick}
            />
          )}
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
  margin-bottom: 2rem;
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

const StatusMessage = styled.p`
  width: 100%;
  text-align: center;
  padding: 2rem 0;
  color: #7a7a7a;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  margin: 0;
`;

const SearchWrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.77vw 1rem 1.77vw;
`;

const BackButton = styled.button`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #666666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #000000;
  }
`;

const SearchTitle = styled.h2`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 1.1875rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const SearchContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const SearchStatusMessage = styled.div`
  width: 100%;
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: #7a7a7a;
`;

const SearchCardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.88rem;
  width: 100%;
`;
