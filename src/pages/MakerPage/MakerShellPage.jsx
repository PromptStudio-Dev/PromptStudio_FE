import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import MakerPage from "./MakerPage";
import MakerPageCard from "./MakerPageCard";
import SearchInput from "./SidePanel/TopPanel/SearchInput";
import MakerPageIcon from "./assets/prompt-maker-image.svg";
import MakerNextButton from "./assets/maker-next-button.svg";
import MakerPrevButton from "./assets/maker-prev-button.svg";
import { createMaker, getMaker } from "./api";

const RUN_STATE = {
  RUN: "RUN",
  NO_RUN: "NO_RUN",
};

const MAKER_NOT_FOUND_MESSAGE = "선택한 Maker를 찾을 수 없습니다.";

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
      // TODO: 실제 API 호출로 교체
      // 메이커 프롬프트 전체 조회(메이커 홈) API 연동
      setMakers([]);
    } catch (error) {
      console.error("Maker 목록을 불러오지 못했습니다.", error);
      setMakerListError("Maker 목록을 불러오지 못했습니다.");
      setMakers([]);
    } finally {
      setIsLoadingMakers(false);
    }
  }, []);

  useEffect(() => {
    fetchMakers();
  }, [fetchMakers, makerView]);

  const findMakerById = useCallback(
    (id) => {
      if (!id) return null;

      // URL 파라미터는 문자열일 수 있으므로 숫자로 변환하여 비교
      const numericId = typeof id === "string" ? Number(id) : id;
      if (Number.isNaN(numericId)) return null;

      const fromState = makers.find((item) => item?.makerId === numericId);

      return fromState ?? null;
    },
    [makers]
  );

  // makerIdParam이 있을 때 메이커 상세 정보 조회
  useEffect(() => {
    if (!makerIdParam) {
      setSelectedMaker(null);
      return;
    }

    // 먼저 state에서 찾아보기
    const candidate = findMakerById(makerIdParam);
    if (candidate) {
      setSelectedMaker((prev) => {
        if (prev?.makerId === candidate?.makerId) {
          return prev;
        }
        return candidate;
      });
      setMakerError(null);
      return;
    }

    // state에 없으면 API 호출
    const fetchMakerDetail = async () => {
      setIsLoadingMakers(true);
      setMakerError(null);

      try {
        const numericId =
          typeof makerIdParam === "string"
            ? Number(makerIdParam)
            : makerIdParam;

        if (Number.isNaN(numericId)) {
          throw new Error("유효하지 않은 메이커 ID입니다.");
        }

        const makerData = await getMaker(numericId);

        // API 응답을 컴포넌트에서 사용하는 형식으로 변환
        const maker = {
          makerId: makerData.makerId,
          title: makerData.title || "새 프롬프트",
          content: makerData.content || "",
          imageUrl: makerData.images?.[0]?.imageUrl || "",
        };

        setSelectedMaker(maker);
        setMakerError(null);

        // makers 목록에도 추가 (중복 방지)
        setMakers((prev) => {
          const exists = prev.find((m) => m.makerId === maker.makerId);
          if (exists) {
            return prev;
          }
          return [maker, ...prev];
        });
      } catch (error) {
        console.error("메이커 상세 정보를 불러오지 못했습니다.", error);
        setSelectedMaker(null);

        let errorMessage = MAKER_NOT_FOUND_MESSAGE;
        if (error?.response?.status === 404) {
          errorMessage = "메이커를 찾을 수 없습니다.";
        } else if (error?.response) {
          errorMessage = `서버 오류: ${error.response.status}`;
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setMakerError(errorMessage);
      } finally {
        setIsLoadingMakers(false);
      }
    };

    fetchMakerDetail();
  }, [makerIdParam, findMakerById]);

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

    try {
      // localStorage에서 memberId 가져오기
      const memberId = localStorage.getItem("memberId");

      if (!memberId) {
        throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
      }

      // API를 통해 메이커 생성
      const response = await createMaker(Number(memberId));
      const { makerId } = response;

      // 생성된 메이커 정보로 새 메이커 객체 생성
      const newMaker = {
        makerId: makerId,
        title: "새 프롬프트",
        content: "",
        imageUrl: "",
      };

      setSelectedMaker(newMaker);
      setMakers((prev) => [newMaker, ...prev]);
      navigate(`/maker/${newMaker.makerId}`);
    } catch (error) {
      console.error("새 Maker를 생성하지 못했습니다.", error);

      let errorMessage = "새 Maker를 생성하지 못했습니다.";

      if (error?.message?.includes("로그인이 필요")) {
        errorMessage = error.message;
      } else if (
        error?.code === "ERR_NAME_NOT_RESOLVED" ||
        error?.message?.includes("ERR_NAME_NOT_RESOLVED")
      ) {
        errorMessage =
          "서버에 연결할 수 없습니다. 서버가 준비되었는지 확인해주세요.";
      } else if (error?.response) {
        errorMessage = `서버 오류: ${error.response.status}`;
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
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
      const searchableText = [maker?.title, maker?.content]
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
                    description={prompt.content}
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
