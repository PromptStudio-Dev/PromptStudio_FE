import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PromptCardList from "./PromptCardList";
import PromptSectionDetail from "./PromptSectionDetail";
import PromptCard from "./PromptCard";
import PromptDetailModal from "./PromptDetailModal";
import backButtonIcon from "../../assets/side-panel-close.svg";
import {
  getRecentPrompts,
  getHotPrompts,
  searchPrompts,
  getPromptDetail,
  getGeneratedPrompts,
  getMyPrompts,
  getLikedPrompts,
} from "../../api";

export default function PromptHub({
  searchKeyword = "",
  onClearSearch,
  selectedHub = "모든 허브",
}) {
  const [currentView, setCurrentView] = useState("main"); // "main" | "detail"
  const [selectedSection, setSelectedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const prevSelectedHubRef = useRef(selectedHub);

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

  // 최근 생성한 프롬프트
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // 내가 작성한 글 상태
  const [myPrompts, setMyPrompts] = useState([]);
  const [isMyPromptsLoading, setIsMyPromptsLoading] = useState(false);
  const [myPromptsError, setMyPromptsError] = useState(null);

  // 좋아요한 프롬프트 상태
  const [likedPrompts, setLikedPrompts] = useState([]);
  const [isLikedPromptsLoading, setIsLikedPromptsLoading] = useState(false);
  const [likedPromptsError, setLikedPromptsError] = useState(null);

  useEffect(() => {
    if (searchKeyword) {
      setCurrentView("main");
      setSelectedSection(null);
    }
  }, [searchKeyword]);

  // selectedHub 변경 시 상세 페이지 닫기
  useEffect(() => {
    // selectedHub가 실제로 변경되었고, 상세 페이지가 열려있을 때만 닫기
    if (
      prevSelectedHubRef.current !== selectedHub &&
      currentView === "detail"
    ) {
      setCurrentView("main");
      setSelectedSection(null);
    }
    prevSelectedHubRef.current = selectedHub;
  }, [selectedHub, currentView]);

  // 내가 작성한 글 조회
  useEffect(() => {
    if (selectedHub !== "내가 작성한 글") {
      return;
    }

    const controller = new AbortController();

    const fetchMyPrompts = async () => {
      setIsMyPromptsLoading(true);
      setMyPromptsError(null);

      try {
        const params = {
          category: "전체",
        };
        const data = await getMyPrompts(params);

        console.log("내가 작성한 글 응답 데이터:", data);

        const formattedPrompts = Array.isArray(data) ? data : [];

        setMyPrompts(formattedPrompts);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("내가 작성한 글을 불러오지 못했습니다.", fetchError);

        let errorMessage = "내가 작성한 글을 불러오지 못했습니다.";
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

        setMyPromptsError(errorMessage);
        setMyPrompts([]);
      } finally {
        setIsMyPromptsLoading(false);
      }
    };

    fetchMyPrompts();

    return () => {
      controller.abort();
    };
  }, [selectedHub]);

  // 좋아요한 프롬프트 조회
  useEffect(() => {
    if (selectedHub !== "좋아요") {
      return;
    }

    const controller = new AbortController();

    const fetchLikedPrompts = async () => {
      setIsLikedPromptsLoading(true);
      setLikedPromptsError(null);

      try {
        const params = {
          category: "전체",
        };
        const data = await getLikedPrompts(params);

        console.log("좋아요한 프롬프트 응답 데이터:", data);

        const formattedPrompts = Array.isArray(data) ? data : [];

        setLikedPrompts(formattedPrompts);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error("좋아요한 프롬프트를 불러오지 못했습니다.", fetchError);

        let errorMessage = "좋아요한 프롬프트를 불러오지 못했습니다.";
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

        setLikedPromptsError(errorMessage);
        setLikedPrompts([]);
      } finally {
        setIsLikedPromptsLoading(false);
      }
    };

    fetchLikedPrompts();

    return () => {
      controller.abort();
    };
  }, [selectedHub]);

  // 최근 조회한 프롬프트 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchRecentPrompts = async () => {
      setIsRecentLoading(true);
      setRecentError(null);

      try {
        const data = await getRecentPrompts();

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
        const memberId = localStorage.getItem("memberId");
        const params = {
          category: "전체",
        };
        if (memberId) {
          params.memberId = Number(memberId);
        }
        const data = await getHotPrompts(params);

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

  // 최근 생성한 프롬프트 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchGeneratedPrompts = async () => {
      setIsAllLoading(true);
      setAllError(null);

      try {
        const memberId = localStorage.getItem("memberId");
        const params = {
          sort: "desc", // 최신순
        };

        if (memberId) {
          params.memberId = Number(memberId);
        }

        const data = await getGeneratedPrompts(params);

        console.log("최근 생성한 프롬프트 응답 데이터:", data);

        const formattedPrompts = Array.isArray(data) ? data : [];

        setGeneratedPrompts(formattedPrompts);
      } catch (fetchError) {
        if (fetchError?.code === "ERR_CANCELED") {
          return;
        }

        console.error(
          "최근 생성한 프롬프트를 불러오지 못했습니다.",
          fetchError
        );

        let errorMessage = "최근 생성한 프롬프트를 불러오지 못했습니다.";
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
        setGeneratedPrompts([]);
      } finally {
        setIsAllLoading(false);
      }
    };

    fetchGeneratedPrompts();

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
        const memberId = localStorage.getItem("memberId");
        const params = {
          category: "전체",
          q: trimmedKeyword,
          query: trimmedKeyword,
        };
        if (memberId) {
          params.memberId = Number(memberId);
        }
        const data = await searchPrompts(params);

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

  // 카드 클릭 시 모달 열기
  const handleCardClick = async (promptId) => {
    console.log("카드 클릭:", promptId);
    if (!promptId) {
      console.error("promptId가 없습니다:", promptId);
      return;
    }
    console.log("모달 열기 - promptId:", promptId);
    setSelectedPromptId(promptId);
    setIsModalOpen(true);
    console.log("모달 상태 업데이트 완료");

    // 최근 조회한 프롬프트 업데이트를 위한 API 호출
    try {
      const memberId = localStorage.getItem("memberId");
      const params = {};
      if (memberId) {
        params.memberId = Number(memberId);
      }
      const data = await getPromptDetail(promptId, params);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromptId(null);
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
      <>
        <PromptSectionDetail
          sectionTitle={selectedSection.title}
          prompts={selectedSection.prompts}
          onCardClick={handleCardClick}
          onBack={handleBack}
        />
        <PromptDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          promptId={selectedPromptId}
        />
      </>
    );
  }

  // "내가 작성한 글" 선택 시
  if (selectedHub === "내가 작성한 글") {
    return (
      <>
        <PromptSectionDetail
          sectionTitle="내가 작성한 글"
          prompts={myPrompts}
          onCardClick={handleCardClick}
          isLoading={isMyPromptsLoading}
          error={myPromptsError}
        />
        <PromptDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          promptId={selectedPromptId}
        />
      </>
    );
  }

  // "좋아요" 선택 시
  if (selectedHub === "좋아요") {
    return (
      <>
        <PromptSectionDetail
          sectionTitle="좋아요"
          prompts={likedPrompts}
          onCardClick={handleCardClick}
          isLoading={isLikedPromptsLoading}
          error={likedPromptsError}
        />
        <PromptDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          promptId={selectedPromptId}
        />
      </>
    );
  }

  if (hasActiveSearch) {
    return (
      <>
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
                {searchResults.map((prompt) => {
                  const id = prompt.promptId || prompt.id;
                  return (
                    <PromptCard
                      key={id}
                      promptId={id}
                      category={prompt.category}
                      aiName={prompt.aiName}
                      title={prompt.title}
                      subtitle={prompt.introduction}
                      backgroundImage={prompt.imageUrl}
                      onClick={() => handleCardClick(id)}
                    />
                  );
                })}
              </SearchCardList>
            )}
          </SearchContent>
        </SearchWrapper>
        <PromptDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          promptId={selectedPromptId}
        />
      </>
    );
  }

  // 메인 뷰 렌더링
  return (
    <>
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
                prompts={recentPrompts}
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
                  onClick={() =>
                    handleMoreClick("인기 프롬프트", popularPrompts)
                  }
                >
                  더보기
                </ViewAllButton>
              )}
            </SectionHeader>
            {isPopularLoading ? (
              <StatusMessage>
                인기 프롬프트를 불러오는 중입니다...
              </StatusMessage>
            ) : popularError ? (
              <StatusMessage>{popularError}</StatusMessage>
            ) : popularPrompts.length === 0 ? (
              <StatusMessage>표시할 인기 프롬프트가 없습니다.</StatusMessage>
            ) : (
              <PromptCardList
                prompts={popularPrompts}
                onCardClick={handleCardClick}
              />
            )}
          </Section>

          {/* 최근 생성한 프롬프트 섹션 */}
          <Section>
            <SectionHeader>
              <SectionTitle>최근 생성한 프롬프트</SectionTitle>
              {!isAllLoading && generatedPrompts.length > 0 && (
                <ViewAllButton
                  onClick={() =>
                    handleMoreClick("최근 생성한 프롬프트", generatedPrompts)
                  }
                >
                  더보기
                </ViewAllButton>
              )}
            </SectionHeader>
            {isAllLoading ? (
              <StatusMessage>
                최근 생성한 프롬프트를 불러오는 중입니다...
              </StatusMessage>
            ) : allError ? (
              <StatusMessage>{allError}</StatusMessage>
            ) : generatedPrompts.length === 0 ? (
              <StatusMessage>
                표시할 최근 생성한 프롬프트가 없습니다.
              </StatusMessage>
            ) : (
              <PromptCardList
                prompts={generatedPrompts}
                onCardClick={handleCardClick}
              />
            )}
          </Section>
        </ContentArea>
      </Wrapper>
      <PromptDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promptId={selectedPromptId}
      />
    </>
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
  padding: 2rem 0 2rem 2.13rem;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 3rem;
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
  font-weight: 600;
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
