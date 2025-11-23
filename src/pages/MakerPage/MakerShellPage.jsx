import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import MakerPage from "./MakerPage";
import MakerPageCard from "./MakerPageCard";
import SearchInput from "./SidePanel/TopPanel/SearchInput";
import MakerPageIcon from "./assets/prompt-maker-image.svg";
import MakerNextButton from "./assets/maker-next-button.svg";
import MakerPrevButton from "./assets/maker-prev-button.svg";

const RUN_STATE = {
  RUN: "RUN",
  NO_RUN: "NO_RUN",
};

const MAKER_NOT_FOUND_MESSAGE = "선택한 Maker를 찾을 수 없습니다.";

// mock data
const RUN_PROMPTS = [
  {
    makerId: 101,
    title: "면접관 시점 자소서 생성",
    introduction:
      "아직도 복사 붙여 넣기만 하는 자소서로 고민하고 계신가요? 실제 면접관의 시선에서 필요한 정보를 선별해 자연스럽고 설득력 있게 정리해주는 자소서 프롬프트로, 읽는 사람에게 분명한 메시지를 전달하는 문장을 만들어보세요.",
    imageUrl: null,
  },
  {
    makerId: 102,
    title: "자연스러운 한국어 문장 생성",
    introduction:
      "AI가 만들어내는 어색함이나 문맥 오류가 걱정되신다면, 상황에 꼭 맞는 자연스러운 흐름을 가진 문장을 생성해보세요. 텍스트의 목적과 분위기를 고려하여 표현을 조절하므로, 실생활에 바로 사용할 수 있는 고품질 문장을 경험하실 수 있습니다.",
    imageUrl: null,
  },
  {
    makerId: 103,
    title: "카페 메뉴판 이미지 만들기",
    introduction:
      "사진 한 장만 업로드하면 감각적인 메뉴판 이미지를 자동으로 완성합니다. 브랜드의 분위기, 색감, 스타일을 고려해 자연스럽고 통일성 있는 디자인을 제공하므로 디자인 툴 없이도 전문적인 메뉴판 이미지를 쉽고 빠르게 제작할 수 있습니다.",
    imageUrl: null,
  },
  {
    makerId: 104,
    title: "고퀄 발표문 자동 생성",
    introduction:
      "복잡한 내용을 발표용 문장으로 다듬기 어려우신가요? 핵심 메시지를 중심으로 구조화하여 발표자가 말하기 편하고 청자가 이해하기 쉬운 형태로 재정리해드립니다. 자연스럽게 흘러가는 고퀄리티 발표문을 손쉽게 준비해보세요.",
    imageUrl: null,
  },
  {
    makerId: 105,
    title: "SNS 홍보 문구 생성",
    introduction:
      "짧은 문장 안에 브랜드의 매력을 담기란 쉽지 않습니다. SNS 특유의 빠른 흐름과 소비 패턴에 맞춰, 자연스럽게 눈길을 끌고 공감을 얻을 수 있는 홍보 문구를 생성해드립니다. 해시태그와 톤까지 고려한 완성도 높은 문구를 받아보세요.",
    imageUrl: null,
  },
  {
    makerId: 106,
    title: "웹사이트 메인 히어로 이미지 생성",
    introduction:
      "웹사이트의 첫인상을 결정하는 히어로 이미지를 감각적으로 생성해드립니다. 브랜드의 정체성, 컬러 톤, 서비스의 주제를 고려해 자연스럽고 강렬한 메인 이미지를 만들어 사이트 전체의 완성도를 한 번에 높일 수 있습니다.",
    imageUrl: null,
  },
  {
    makerId: 107,
    title: "블로그 서론 매끄럽게 작성",
    introduction:
      "독자의 관심을 끌어야 하는 블로그 서론이 가장 어렵다면, 핵심 주제를 자연스럽게 흘러가도록 소개하는 매끄러운 서론을 생성해보세요. 글 전체의 톤을 맞추면서도 독자가 읽고 싶게 만드는 매력적인 도입부를 손쉽게 완성합니다.",
    imageUrl: null,
  },
  {
    makerId: 108,
    title: "경험 기반 이력서 문장 생성",
    introduction:
      "경험은 많은데 문장으로 정리하기 어렵다면, 핵심 성과 중심으로 전문적이고 깔끔하게 재구성해드립니다. 불필요한 정보는 줄이고 강조해야 할 부분은 명확히 드러내 자연스럽게 읽히는 고품질 이력서 문장을 완성하세요.",
    imageUrl: null,
  },
  {
    makerId: 109,
    title: "프로젝트 소개문 자동 생성",
    introduction:
      "프로젝트 목적, 기여도, 문제 해결 과정, 성과를 한 문장에 담기 어렵다면 이 프롬프트를 활용해보세요. 기술적 정보는 쉽게 풀어내고 성과는 명확히 보여주는 방식으로 자연스럽게 구성된 프로젝트 소개문을 만들어드립니다.",
    imageUrl: null,
  },
  {
    makerId: 110,
    title: "이메일 전문적 톤으로 변환",
    introduction:
      "비즈니스 상황에서 어색한 말투가 걱정된다면, 자연스럽고 전문적인 이메일 문장으로 변환해보세요. 지나치게 딱딱하지 않으면서도 예의를 갖춘 균형 잡힌 톤으로 작성되어 어떤 상황에도 바로 사용할 수 있는 완성도 높은 이메일을 만든습니다.",
    imageUrl: null,
  },
];

const NO_RUN_PROMPTS = [
  {
    makerId: 201,
    title: "팀 온보딩 교육 스크립트",
    introduction:
      "회사 철학과 업무 프로세스를 쉽고 자연스럽게 설명하는 온보딩 스크립트를 구성합니다.",
  },
  {
    makerId: 202,
    title: "기업 문화 뉴스레터",
    introduction:
      "한 주간의 사내 소식을 정리해 구성원들에게 전달할 수 있는 템플릿을 생성하세요.",
  },
];

export default function MakerShellPage() {
  const navigate = useNavigate();
  const { makerId: makerIdParam } = useParams();
  const [makerView, setMakerView] = useState(RUN_STATE.RUN);
  const [makers, setMakers] = useState([]);
  const [selectedMaker, setSelectedMaker] = useState(null);
  const [isLoadingMakers, setIsLoadingMakers] = useState(false);
  const [makerListError, setMakerListError] = useState(null);
  const [isCreatingMaker, setIsCreatingMaker] = useState(false);
  const [makerError, setMakerError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const CARDS_PER_PAGE = 9;

  const fetchMakers = useCallback(async () => {
    setIsLoadingMakers(true);
    setMakerListError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setMakers(makerView === RUN_STATE.RUN ? RUN_PROMPTS : NO_RUN_PROMPTS);
    } catch (error) {
      console.error("Maker 목록을 불러오지 못했습니다.", error);
      setMakerListError("Maker 목록을 불러오지 못했습니다.");
      setMakers([]);
    } finally {
      setIsLoadingMakers(false);
    }
  }, [makerView]);

  useEffect(() => {
    fetchMakers();
  }, [fetchMakers, makerView]);

  const findMakerById = useCallback(
    (id) => {
      if (!id) return null;

      const fromState = makers.find((item) => item?.makerId === id);

      if (fromState) {
        return fromState;
      }

      const fromRun = RUN_PROMPTS.find((item) => item?.makerId === id);

      if (fromRun) {
        return fromRun;
      }

      const fromNoRun = NO_RUN_PROMPTS.find((item) => item?.makerId === id);

      return fromNoRun ?? null;
    },
    [makers]
  );

  useEffect(() => {
    if (!makerIdParam) {
      setSelectedMaker(null);
      return;
    }

    const candidate = findMakerById(makerIdParam);

    if (candidate) {
      setSelectedMaker((prev) => {
        if (prev?.makerId === candidate?.makerId) {
          return prev;
        }

        return candidate;
      });
      setMakerError(null);
    } else if (!isLoadingMakers) {
      setSelectedMaker(null);
      setMakerError(MAKER_NOT_FOUND_MESSAGE);
    }
  }, [findMakerById, isLoadingMakers, makerIdParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [makerView, searchKeyword]);

  useEffect(() => {
    if (!makerIdParam && makerError === MAKER_NOT_FOUND_MESSAGE) {
      setMakerError(null);
    }
  }, [makerError, makerIdParam]);

  const handleCreateMaker = useCallback(async () => {
    setIsCreatingMaker(true);
    setMakerError(null);

    // 현재 프론트에서 makerId 임의로 생성(백엔드에서 생성)
    try {
      const newMaker = {
        makerId: Date.now(),
        title: "새 프롬프트",
        introduction: "아이디어를 자유롭게 펼쳐보세요.",
        content: "",
        imageUrl: "",
      };

      setSelectedMaker(newMaker);
      setMakers((prev) => [newMaker, ...prev]);
      navigate(`/maker/${newMaker.makerId}`);
    } catch (error) {
      console.error("새 Maker를 생성하지 못했습니다.", error);

      let errorMessage = "새 Maker를 생성하지 못했습니다.";

      if (
        error?.code === "ERR_NAME_NOT_RESOLVED" ||
        error?.message?.includes("ERR_NAME_NOT_RESOLVED")
      ) {
        errorMessage =
          "서버에 연결할 수 없습니다. 서버가 준비되었는지 확인해주세요.";
      } else if (error?.response) {
        errorMessage = `서버 오류: ${error.response.status}`;
      } else if (error?.request) {
        errorMessage = "서버로부터 응답을 받지 못했습니다.";
      }

      setMakerError(errorMessage);
    } finally {
      setIsCreatingMaker(false);
    }
  }, [navigate]);

  const handleSelectMaker = useCallback(
    async (makerId) => {
      if (!makerId) {
        return;
      }

      navigate(`/maker/${makerId}`);
    },
    [navigate]
  );

  const handleDeleteMaker = useCallback((makerId) => {
    if (!makerId) {
      return;
    }

    // TODO: 실제 삭제 API 호출
    console.log("삭제:", makerId);
    setMakers((prev) => prev.filter((maker) => maker?.makerId !== makerId));
  }, []);

  const makerKey = useMemo(() => {
    if (!selectedMaker) return "maker-empty";
    return selectedMaker?.makerId ?? "maker-selected";
  }, [selectedMaker]);

  // 검색 부분(프론트에서 검색 처리 - 단순 검색)
  const filteredMakers = useMemo(() => {
    if (!searchKeyword.trim()) {
      return makers;
    }

    const keyword = searchKeyword.trim().toLowerCase();

    return makers.filter((maker) => {
      const searchableText = [maker?.title, maker?.introduction]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [makers, searchKeyword]);

  const totalPages = Math.max(
    1,
    Math.ceil((filteredMakers?.length ?? 0) / CARDS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMakers = useMemo(() => {
    if (!filteredMakers?.length) {
      return [];
    }

    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;

    return filteredMakers.slice(startIndex, endIndex);
  }, [filteredMakers, currentPage]);

  const handleSearchChange = useCallback((valueOrEvent) => {
    if (typeof valueOrEvent === "string") {
      setSearchKeyword(valueOrEvent);
      return;
    }

    const nextValue = valueOrEvent?.target?.value;
    setSearchKeyword(nextValue ?? "");
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleChangeView = useCallback((view) => {
    setMakerView(view);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  // makerId가 있는 경우 = 프롬프트 상세 페이지
  if (makerIdParam) {
    if (!selectedMaker) {
      return (
        <MakerWrapper>
          <MakerContent>
            <CenteredContainer>
              {isLoadingMakers || isCreatingMaker ? (
                <InlineStatus>프롬프트를 불러오는 중...</InlineStatus>
              ) : (
                <InlineError>
                  {makerError ?? MAKER_NOT_FOUND_MESSAGE}
                </InlineError>
              )}
            </CenteredContainer>
          </MakerContent>
        </MakerWrapper>
      );
    }

    return (
      <MakerWrapper>
        <MakerContent>
          <MakerPage key={makerKey} selectedPrompt={selectedMaker} />
        </MakerContent>
      </MakerWrapper>
    );
  }

  if (selectedMaker) {
    return (
      <MakerWrapper>
        <MakerContent>
          <MakerPage key={makerKey} selectedPrompt={selectedMaker} />
        </MakerContent>
      </MakerWrapper>
    );
  }

  return (
    <MakerShellWrapper>
      <Inner>
        <TopSection>
          <TopRow>
            <SearchWrapper>
              <SearchInput
                value={searchKeyword}
                onChange={handleSearchChange}
                onSearch={handleSearchSubmit}
                placeholder=""
                width="28.8125rem"
              />
            </SearchWrapper>

            <PrimaryButton
              type="button"
              onClick={handleCreateMaker}
              disabled={isCreatingMaker}
            >
              <MakerPageIconImg src={MakerPageIcon} />
              {isCreatingMaker ? "생성 중..." : "프롬프트 메이커"}
            </PrimaryButton>
          </TopRow>

          <ToggleRow>
            <ToggleButton
              type="button"
              data-active={makerView === RUN_STATE.RUN}
              onClick={() => handleChangeView(RUN_STATE.RUN)}
            >
              <ToggleButtonText>RUN</ToggleButtonText>
            </ToggleButton>
            <ToggleButton
              type="button"
              data-active={makerView === RUN_STATE.NO_RUN}
              onClick={() => handleChangeView(RUN_STATE.NO_RUN)}
            >
              <ToggleButtonText>NO RUN</ToggleButtonText>
            </ToggleButton>
          </ToggleRow>

          <CardGridContainer>
            <CardGrid>
              {isLoadingMakers ? (
                <InlineStatus>프롬프트를 불러오는 중...</InlineStatus>
              ) : makerListError ? (
                <InlineError>{makerListError}</InlineError>
              ) : filteredMakers.length === 0 ? (
                <InlineStatus>검색 결과가 없습니다.</InlineStatus>
              ) : (
                paginatedMakers.map((prompt) => (
                  <MakerPageCard
                    key={prompt?.makerId}
                    title={prompt.title}
                    description={prompt.introduction}
                    imageUrl={prompt.imageUrl}
                    onClick={() => handleSelectMaker(prompt?.makerId)}
                    onDelete={() => handleDeleteMaker(prompt?.makerId)}
                  />
                ))
              )}
            </CardGrid>
            {filteredMakers.length > 0 && (
              <PaginationRow>
                <PaginationButton
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <PageButtonImg src={MakerPrevButton} />
                </PaginationButton>
                <MoreButtonText>더보기</MoreButtonText>
                <PageIndicator>
                  <CurrentPage>{currentPage}</CurrentPage>
                  <PageSeparator>/</PageSeparator>
                  <TotalPage>{totalPages}</TotalPage>
                </PageIndicator>
                <PaginationButton
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <PageButtonImg src={MakerNextButton} />
                </PaginationButton>
              </PaginationRow>
            )}
          </CardGridContainer>
        </TopSection>
      </Inner>
    </MakerShellWrapper>
  );
}

const MakerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #ffffff;
`;

const MakerContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const MakerPageIconImg = styled.img`
  width: 1.4219rem;
  height: auto;
`;
const MakerShellWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1920px;
  padding: 2rem 3rem 2.94rem;
  box-sizing: border-box;
  gap: 2.5rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 30.19rem;
`;

const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.37rem;
  border: none;
  padding: 0.58rem 2.12rem 0.7rem 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(99deg, #49d8ff -86.38%, #269aed 148.91%);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.3125rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:disabled {
    background-color: #9bb4d8;
    cursor: not-allowed;
  }
`;

const PageButtonImg = styled.img`
  width: 2.875rem;
  height: auto;
`;

const ToggleRow = styled.div`
  display: flex;
  gap: 0.5rem;

  /* 아래 속성들을 추가/수정하여 그리드 너비와 맞추고 왼쪽 정렬합니다 */
  width: 100%;
  max-width: min(
    calc(100% - 40rem),
    calc(1920px - 67rem)
  ); /* CardGridContainer와 동일한 너비 제한 */
  justify-content: flex-start; /* 왼쪽 정렬 */
`;

const ToggleButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  padding: 0.62rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  background-color: ${(props) =>
    props["data-active"] ? "#DBF5FF" : "#F2F2F2"};
  color: ${(props) => (props["data-active"] ? "#00AEFF" : "#D9D9D9")};
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const ToggleButtonText = styled.span`
  font-size: 1.1875rem;
  font-weight: 600;
`;

const InlineError = styled.div`
  color: #ff4d4f;
  font-size: 0.95rem;
`;

const InlineStatus = styled.div`
  color: #4f7098;
  font-size: 0.95rem;
`;

const CardGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 3rem;
  max-width: min(calc(100% - 6rem), calc(1920px - 6rem));
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  width: 100%;
  justify-content: center;
  min-height: calc(12.625rem * 3 + 2.5rem * 2);

  @media (max-width: 1600px) {
    gap: 2.2rem;
  }

  @media (max-width: 1400px) {
    gap: 2rem;
  }

  @media (max-width: 1200px) {
    gap: 1.5rem;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(
    calc(3 * 22.375rem + 2 * 3.12rem),
    100%
  ); /* 카드 그리드 너비와 동일하되 컨테이너를 넘지 않음 */
  gap: 1rem;
`;

const PaginationButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
`;

const MoreButtonText = styled.p`
  color: #000000;
  font-size: 1.1875rem;
  font-family: "Pretendard Variable", sans-serif;
`;

const PageIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.1875rem;
  font-weight: 600;
  font-family: "Pretendard Variable", sans-serif;
`;

const CurrentPage = styled.span`
  color: #000000;
`;

const PageSeparator = styled.span`
  color: #a0a0a0;
`;

const TotalPage = styled.span`
  color: #a0a0a0;
`;
