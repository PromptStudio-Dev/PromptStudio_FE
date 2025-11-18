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
    title: "카페 메뉴판 이미지 만들기",
    introduction:
      "아직도 복사 붙여 넣기만 하세요? 문장감 있는 자소설 프롬프트를 공유받아 보세요! 자연스럽고 깔끔한 문장을 작성해보세요.",
    imageUrl: null,
  },
  {
    makerId: 102,
    title: "미니멀 감성 프로필 사진 생성",
    introduction:
      "사진 없이도 자연스러운 분위기의 프로필 이미지를 만들어보세요. 부자연스러운 요소를 줄이고 깔끔하게 표현합니다.",
    imageUrl: null,
  },
  {
    makerId: 103,
    title: "인스타 감성 여행사진 만들기",
    introduction:
      "복잡한 편집 없이 감성적인 여행 사진을 만들어보세요. 흐릿한 요소를 보정해 자연스럽게 완성합니다.",
    imageUrl: null,
  },
  {
    makerId: 104,
    title: "고급스러운 브랜드 로고 생성",
    introduction:
      "브랜드 로고가 필요하신가요? 단 몇 줄의 문장으로 심플하고 인상적인 로고를 만들 수 있습니다.",
    imageUrl: null,
  },
  {
    makerId: 105,
    title: "AI 프레젠테이션 배경 이미지 제작",
    introduction:
      "프레젠테이션에 사용할 감성적인 배경 이미지를 자동으로 생성해보세요. 자연스럽고 정돈된 결과물을 얻을 수 있습니다.",
    imageUrl: null,
  },
  {
    makerId: 106,
    title: "웹사이트 메인 히어로 이미지 생성",
    introduction:
      "웹사이트 톤에 맞춘 메인 이미지를 쉽고 빠르게 생성해보세요. 브랜드 분위기에 맞춘 자연스러운 표현이 가능합니다.",
    imageUrl: null,
  },
  {
    makerId: 107,
    title: "AI 카드뉴스 이미지 자동 제작",
    introduction:
      "카드뉴스 디자인이 어렵다면 AI에게 맡겨보세요. 자연스럽고 눈에 잘 들어오는 구성을 만들어줍니다.",
    imageUrl: null,
  },
  {
    makerId: 108,
    title: "편안한 분위기 인테리어 무드보드 제작",
    introduction:
      "따뜻하고 안정감 있는 인테리어 무드보드를 쉽게 만들 수 있는 프롬프트입니다. 과한 요소를 줄여 부드러운 느낌을 살립니다.",
    imageUrl: null,
  },
  {
    makerId: 109,
    title: "카페 메뉴판 이미지 만들기",
    introduction:
      "디자인 경험 없이도 고급스러운 카페 메뉴판 이미지를 만들 수 있습니다. 문장만 넣어도 자연스럽게 완성됩니다.",
    imageUrl: null,
  },
  {
    makerId: 110,
    title: "카페 메뉴판 이미지 만들기",
    introduction:
      "디자인 경험 없이도 고급스러운 카페 메뉴판 이미지를 만들 수 있습니다. 문장만 넣어도 자연스럽게 완성됩니다.",
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

  const normalizeId = useCallback((rawId) => {
    if (rawId === null || rawId === undefined) return null;
    const asNumber = Number(rawId);
    if (!Number.isNaN(asNumber)) {
      return asNumber.toString();
    }
    return String(rawId);
  }, []);

  const findMakerById = useCallback(
    (id) => {
      if (!id) return null;
      const targetId = normalizeId(id);

      const fromState = makers.find((item) =>
        [item?.makerId, item?.promptId, item?.id, item?.makerID]
          .filter((candidate) => candidate !== undefined && candidate !== null)
          .map(normalizeId)
          .includes(targetId)
      );

      if (fromState) {
        return fromState;
      }

      const fromRun = RUN_PROMPTS.find((item) =>
        [item?.makerId, item?.promptId, item?.id, item?.makerID]
          .filter((candidate) => candidate !== undefined && candidate !== null)
          .map(normalizeId)
          .includes(targetId)
      );

      if (fromRun) {
        return fromRun;
      }

      const fromNoRun = NO_RUN_PROMPTS.find((item) =>
        [item?.makerId, item?.promptId, item?.id, item?.makerID]
          .filter((candidate) => candidate !== undefined && candidate !== null)
          .map(normalizeId)
          .includes(targetId)
      );

      return fromNoRun ?? null;
    },
    [makers, normalizeId]
  );

  useEffect(() => {
    if (!makerIdParam) {
      setSelectedMaker(null);
      return;
    }

    const candidate = findMakerById(makerIdParam);

    if (candidate) {
      setSelectedMaker((prev) => {
        const prevId = normalizeId(
          prev?.makerId ?? prev?.promptId ?? prev?.id ?? prev?.makerID
        );
        const nextId = normalizeId(
          candidate?.makerId ??
            candidate?.promptId ??
            candidate?.id ??
            candidate?.makerID
        );

        if (prevId === nextId) {
          return prev;
        }

        return candidate;
      });
      setMakerError(null);
    } else if (!isLoadingMakers) {
      setSelectedMaker(null);
      setMakerError(MAKER_NOT_FOUND_MESSAGE);
    }
  }, [findMakerById, isLoadingMakers, makerIdParam, normalizeId]);

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
        promptId: null,
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

  const makerKey = useMemo(() => {
    if (!selectedMaker) return "maker-empty";
    return (
      selectedMaker?.makerId ??
      selectedMaker?.promptId ??
      selectedMaker?.id ??
      "maker-selected"
    );
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
              paginatedMakers.map((prompt, index) => (
                <MakerPageCard
                  key={
                    prompt?.makerId ??
                    prompt?.promptId ??
                    prompt?.id ??
                    `prompt-${index}`
                  }
                  title={prompt.title}
                  description={prompt.introduction}
                  imageUrl={prompt.imageUrl}
                  onClick={() =>
                    handleSelectMaker(
                      prompt?.makerId ??
                        prompt?.promptId ??
                        prompt?.id ??
                        prompt?.makerID
                    )
                  }
                />
              ))
            )}
          </CardGrid>
        </CardGridContainer>

        {filteredMakers.length > 0 && (
          <PaginationWrapper>
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
          </PaginationWrapper>
        )}
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

const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 3.5rem;
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
  gap: 0.75rem;

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
  gap: 1.25rem;
  max-width: min(calc(100% - 6rem), calc(1920px - 6rem));
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.5rem;
  min-height: calc(12.625rem * 3 + 2.5rem * 2);
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 7rem;
  margin-bottom: 0;
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
