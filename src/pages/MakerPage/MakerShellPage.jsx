import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MakerPage from "./MakerPage";
import MakerPageCard from "./MakerPageCard";
import SearchInput from "./SidePanel/TopPanel/SearchInput";
import MakerPageIcon from "./assets/prompt-maker-image.svg";
import MakerNextButton from "./assets/maker-next-button.svg";
import MakerPrevButton from "./assets/maker-prev-button.svg";
import { createMaker, getMaker, getMakers, deleteMaker } from "./api";
import { isLoggedIn } from "../../utils/authStorage";
import { useLoginModal } from "../../contexts/LoginModalContext";
import LoginRequiredModal from "../../components/LoginRequiredModal/LoginRequiredModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import WarningIcon from "../../components/LoginRequiredModal/assets/warningIcon.svg";
import OnboardingModal, {
  hasSeenMakerOnboarding,
  getMakerSlides,
  getMakerOnboardingKey,
} from "../../components/OnboardingModal/OnboardingModal";

const RUN_STATE = {
  RUN: "RUN",
  NO_RUN: "NO_RUN",
};

const MAKER_NOT_FOUND_MESSAGE = "선택한 Maker를 찾을 수 없습니다.";

export default function MakerShellPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openLoginModal, startGoogleLogin } = useLoginModal();
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [makerIdToDelete, setMakerIdToDelete] = useState(null);
  const [showMakerOnboarding, setShowMakerOnboarding] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isAuthErrorModalOpen, setIsAuthErrorModalOpen] = useState(false);
  const authGuardedRef = useRef(false);

  const CARDS_PER_PAGE = 9;

  const fetchMakers = useCallback(async () => {
    setIsLoadingMakers(true);
    setMakerListError(null);

    try {
      if (!isLoggedIn()) {
        openLoginModal();
        setMakers([]);
        return;
      }
      // RUN / NO RUN에 따라 hasHistory(boolean) 결정
      const hasHistory = makerView === RUN_STATE.RUN;

      // 백엔드 메이커 전체 조회 API 호출
      // page=0, size=1000 으로 충분히 많이 가져와서
      // 프론트에서 CARDS_PER_PAGE(9) 단위로 페이징
      const response = await getMakers({
        hasHistory,
        page: 0,
        size: 1000,
      });

      const makerList = Array.isArray(response?.makers) ? response.makers : [];

      // 카드에서 사용할 수 있도록 필요한 필드만 정규화
      // RUN: 카드에는 결과 텍스트/이미지, 상세 페이지의 에디터에는 항상 사용자가 작성한 텍스트(content)
      const normalized = makerList.map((maker) => {
        const isRun = makerView === RUN_STATE.RUN;

        const safeContent = (maker.content || "").trim();
        const safeResultText = (maker.resultText || "").trim();
        const safeTitle = (maker.title || "").trim();

        // RUN일 때만 결과 이미지를 카드 썸네일로 사용
        const imageUrl =
          isRun && maker.resultType === "IMAGE" && maker.resultImageUrl
            ? maker.resultImageUrl
            : "";

        // 리스트 카드에 보여줄 텍스트 (RUN에서 결과 텍스트가 비었으면 사용자가 작성한 content로 대체)
        const displayContent = isRun
          ? safeResultText || safeContent || ""
          : safeContent || "";

        return {
          makerId: maker.makerId,
          title: safeTitle || "새로운 프롬프트",
          // 상세 페이지의 PromptEditor에 들어갈 사용자가 작성한 원본 텍스트
          content: safeContent,
          // 리스트(카드)에서만 사용하는 표시용 텍스트
          displayContent,
          imageUrl,
          resultType: maker.resultType,
          resultText: maker.resultText,
          resultImageUrl: maker.resultImageUrl,
          updatedAt: maker.updatedAt,
        };
      });

      setMakers(normalized);
    } catch (error) {
      console.error("Maker 목록을 불러오지 못했습니다.", error);
      // 비로그인 상태면 로그인 모달로 안내
      if (!isLoggedIn()) {
        openLoginModal();
        setMakers([]);
        return;
      }
      // 401/403 에러인 경우 인증 에러 모달 표시
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setIsAuthErrorModalOpen(true);
        setMakers([]);
        return;
      }

      // 일반 오류는 ErrorModal로 표시
      setIsErrorModalOpen(true);
      setMakers([]);
    } finally {
      setIsLoadingMakers(false);
    }
  }, [makerView, openLoginModal]);

  // 로그인 여부 선행 체크: 비로그인 시 허브로 돌려보내고 로그인 모달 오픈
  useEffect(() => {
    if (authGuardedRef.current) return;
    if (!isLoggedIn()) {
      authGuardedRef.current = true;
      openLoginModal();
      navigate("/", { replace: true });
      return;
    }
    // 로그인된 상태에서만 온보딩 체크
    if (!hasSeenMakerOnboarding()) {
      // 데이터 로딩 후 온보딩 표시를 위해 약간의 딜레이
      const timer = setTimeout(() => {
        setShowMakerOnboarding(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [navigate, openLoginModal]);

  useEffect(() => {
    fetchMakers();
  }, [fetchMakers, makerView]);

  // 동일 경로로 돌아왔을 때도 최신 자동저장 내용을 반영하도록 재조회
  useEffect(() => {
    if (location.pathname.includes("/maker")) {
      fetchMakers();
    }
  }, [location.pathname, fetchMakers]);

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

    // 먼저 state에서 찾아본 뒤, 있으면 즉시 표시하되
    // 항상 상세 조회 API를 한 번 더 호출해서 최신 자동 저장 내용/이미지를 반영한다.
    const candidate = findMakerById(makerIdParam);
    if (candidate) {
      setSelectedMaker((prev) => {
        if (prev?.makerId === candidate?.makerId) {
          return prev;
        }
        return candidate;
      });
      setMakerError(null);
    }

    // 상세 정보는 항상 API로 최신 상태를 다시 가져온다.
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

        // 목록에서 가져온 결과 정보가 있다면 그대로 유지
        const baseResultInfo =
          candidate && candidate.makerId === makerData.makerId
            ? {
                resultType: candidate.resultType,
                resultText: candidate.resultText,
                resultImageUrl: candidate.resultImageUrl,
              }
            : {
                resultType: makerData.resultType,
                resultText: makerData.resultText,
                resultImageUrl: makerData.resultImageUrl,
              };

        // API 응답을 컴포넌트에서 사용하는 형식으로 변환
        const maker = {
          makerId: makerData.makerId,
          title: makerData.title || "", // 백엔드에서 오는 값(기본값: 새로운 프롬프트)
          content: makerData.content || "",
          imageUrl: makerData.images?.[0]?.imageUrl || "",
          images: makerData.images || [], // images 배열 전체 전달
          ...baseResultInfo,
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
        openLoginModal();
        throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
      }

      if (!isLoggedIn()) {
        openLoginModal();
        throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
      }

      // API를 통해 메이커 생성
      const response = await createMaker(Number(memberId));
      const { makerId } = response;

      // 생성된 메이커 정보로 새 메이커 객체 생성
      const newMaker = {
        makerId: makerId,
        title: "", // 빈 문자열로 설정하여 placeholder 표시
        content: "",
        imageUrl: "",
      };

      setSelectedMaker(newMaker);
      setMakers((prev) => [newMaker, ...prev]);
      navigate(`/maker/${newMaker.makerId}`);
    } catch (error) {
      console.error("새 Maker를 생성하지 못했습니다.", error);

      // 401/403 에러인 경우 인증 에러 모달 표시
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setIsAuthErrorModalOpen(true);
        return;
      }

      // 일반 오류는 ErrorModal로 표시
      setIsErrorModalOpen(true);
    } finally {
      setIsCreatingMaker(false);
    }
  }, [navigate, openLoginModal]);

  const handleSelectMaker = useCallback(
    async (makerId) => {
      if (!isLoggedIn()) {
        openLoginModal();
        return;
      }
      if (!makerId) {
        return;
      }

      navigate(`/maker/${makerId}`);
    },
    [navigate, openLoginModal]
  );

  const handleDeleteClick = useCallback((makerId) => {
    if (!makerId) {
      return;
    }
    setMakerIdToDelete(makerId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
    setMakerIdToDelete(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!makerIdToDelete) {
      return;
    }

    try {
      // 서버에서 메이커 삭제
      await deleteMaker(makerIdToDelete);

      // 프론트 목록에서 해당 메이커 제거
      setMakers((prev) =>
        prev.filter((maker) => maker?.makerId !== makerIdToDelete)
      );

      // 선택된 메이커가 삭제된 경우 상세 페이지 초기화
      setSelectedMaker((prev) => {
        if (prev?.makerId === makerIdToDelete) {
          return null;
        }
        return prev;
      });

      // 모달 닫기
      setIsDeleteModalOpen(false);
      setMakerIdToDelete(null);

      // 백엔드 상태와 동기화(실제 삭제 여부 확인)
      await fetchMakers();
    } catch (error) {
      console.error("메이커를 삭제하지 못했습니다.", error);
      setMakerListError("메이커를 삭제하지 못했습니다.");
      setIsDeleteModalOpen(false);
      setMakerIdToDelete(null);
    }
  }, [makerIdToDelete, setMakers, fetchMakers]);

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

  const filledMakers = useMemo(() => {
    const list = paginatedMakers;
    const missing = CARDS_PER_PAGE - list.length;

    if (missing <= 0) return list;

    // placeholder 5개, 3개 등 자동 생성
    const placeholders = Array.from({ length: missing }, (_, i) => ({
      placeholder: true,
      id: `placeholder-${i}`,
    }));

    return [...list, ...placeholders];
  }, [paginatedMakers]);

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
          <MakerContent></MakerContent>
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
                <InlineStatus>
                  나만의 고퀄리티 프롬프트로 효율을 높여보세요
                </InlineStatus>
              ) : (
                filledMakers.map((prompt) =>
                  prompt.placeholder ? (
                    <EmptyCard key={prompt.id} />
                  ) : (
                    <MakerPageCard
                      key={prompt.makerId}
                      title={prompt.title}
                      description={prompt.displayContent ?? prompt.content}
                      imageUrl={prompt.imageUrl}
                      onClick={() => handleSelectMaker(prompt?.makerId)}
                      onDelete={() => handleDeleteClick(prompt?.makerId)}
                    />
                  )
                )
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
      {isDeleteModalOpen && (
        <DeleteModalOverlay onClick={handleDeleteCancel}>
          <DeleteModalContainer onClick={(e) => e.stopPropagation()}>
            <DeleteModalText>
              삭제하시면 되돌릴 수 없습니다.
              <br />
              정말 삭제하시겠습니까?
            </DeleteModalText>
            <DeleteModalButtonGroup>
              <DeleteModalCancelButton onClick={handleDeleteCancel}>
                취소
              </DeleteModalCancelButton>
              <DeleteModalConfirmButton onClick={handleDeleteConfirm}>
                삭제
              </DeleteModalConfirmButton>
            </DeleteModalButtonGroup>
          </DeleteModalContainer>
        </DeleteModalOverlay>
      )}
      {/* MakerPage 온보딩 모달 */}
      <OnboardingModal
        isOpen={showMakerOnboarding}
        onClose={() => setShowMakerOnboarding(false)}
        slides={getMakerSlides()}
        onboardingKey={getMakerOnboardingKey()}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        text="오류가 발생했습니다.\n잠시 후 다시 시도해주세요."
      />
      <LoginRequiredModal
        isOpen={isAuthErrorModalOpen}
        onClose={() => {
          navigate("/");
          setIsAuthErrorModalOpen(false);
        }}
        icon={WarningIcon}
        text="인증이 만료되었습니다.\n다시 로그인해주세요."
        buttonText="로그인 하기"
        onButtonClick={() => {
          startGoogleLogin();
          setIsAuthErrorModalOpen(false);
        }}
        showCloseButton={true}
      />
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
  color: #929292;
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

const EmptyCard = styled.div`
  width: 100%;
  aspect-ratio: 358 / 202;
  border-radius: 1.1rem;
  min-width: 12.25rem;
  max-width: 22.375rem;
  aspect-ratio: 358 / 202;
  visibility: hidden; /* 공간은 유지, 보이진 않음 */
`;

const DeleteModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const DeleteModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.625rem 3.0625rem 1.125rem 3.625rem;
  border-radius: 1rem;
  background: #282828;
`;

const DeleteModalText = styled.div`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const DeleteModalButtonGroup = styled.div`
  display: flex;
  gap: 1.125rem;
  align-items: center;
`;

const DeleteModalCancelButton = styled.button`
  display: flex;
  width: 4rem;
  height: 1.8125rem;
  padding: 0.375rem 0.625rem;
  justify-content: center;
  align-items: center;
  border-radius: 7.5rem;
  border: 0.0313rem solid #fff;
  background: transparent;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const DeleteModalConfirmButton = styled.button`
  display: flex;
  width: 4rem;
  height: 1.8125rem;
  padding: 0.375rem 0.625rem;
  justify-content: center;
  align-items: center;
  border-radius: 7.5rem;
  border: 0.0313rem solid #fff;
  background: #fff;
  color: #282828;
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;
