import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import ResultPanel from "./ResultPanel/ResultPanel";
import ResultModal from "./shared/ResultModal";
import {
  autoSaveMaker,
  upgradeMakerText,
  reupgradeMakerText,
} from "./api/makers";
import {
  runPrompt,
  getRunHistory,
  restoreHistory,
  getPromptFeedback,
} from "./api/results";

export default function MakerPage({ selectedPrompt = null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResultPanelOpen, setIsResultPanelOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isResultPanelExpanded, setIsResultPanelExpanded] = useState(false);
  const [upgrades, setUpgrades] = useState([]);
  const [promptTitle, setPromptTitle] = useState(selectedPrompt?.title ?? "");
  const [promptContent, setPromptContent] = useState(
    selectedPrompt?.content ?? ""
  );
  const [attachedImages, setAttachedImages] = useState([]);
  const [latestUpgradeId, setLatestUpgradeId] = useState(null);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(1);
  const [resultImageUrl, setResultImageUrl] = useState(
    selectedPrompt?.resultImageUrl ?? null
  );
  const [resultText, setResultText] = useState(
    selectedPrompt?.resultText ?? null
  );

  const [_resultType, setResultType] = useState(
    selectedPrompt?.resultType ?? null
  );
  const [resultFeedback, setResultFeedback] = useState(null);
  const [historyFeedbackMap, setHistoryFeedbackMap] = useState({});
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [currentMakerId, setCurrentMakerId] = useState(
    selectedPrompt?.makerId ?? null
  );
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [insertedTextRange, setInsertedTextRange] = useState(null); // 삽입된 텍스트 위치
  const saveIntervalRef = useRef(null);
  const skipNextAutoSaveRef = useRef(false);
  const isSavingRef = useRef(false);
  const isInitialLoadRef = useRef(true); // 초기 로드 여부 추적

  // 이전 값 추적 (변경사항 체크용)
  // 초기값을 selectedPrompt의 값으로 설정
  const prevValuesRef = useRef({
    title: selectedPrompt?.title ?? "",
    content: selectedPrompt?.content ?? "",
    imageUrls:
      selectedPrompt?.images
        ?.map((img) => img.imageUrl || img.url)
        .filter(Boolean) ?? [],
    newImageCount: 0,
  });

  // 히스토리 목록 조회 (목록/인덱스만 세팅, 내용은 자동 복원하지 않음)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentMakerId) return;

      try {
        const histories = await getRunHistory(currentMakerId);
        const formattedHistories = histories.map((history) => ({
          id: history.historyId,
          title: history.title || `History ${history.historyId}`,
          createdAt: history.createdAt || null,
        }));
        setHistoryItems(formattedHistories);

        // 가장 최신 히스토리의 인덱스/ID만 기억
        if (formattedHistories.length > 0) {
          const latest = formattedHistories[0];
          setCurrentHistoryIndex(1);
          setCurrentHistoryId(latest.id);
        }
      } catch (error) {
        console.error("히스토리 조회 실패:", error);
      }
    };

    fetchHistory();
  }, [currentMakerId]);

  // makerId 변경 시, 로컬스토리지에 저장된 피드백 캐시 불러오기
  useEffect(() => {
    if (!currentMakerId) return;

    try {
      const raw = localStorage.getItem(`makerFeedback:${currentMakerId}`);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setHistoryFeedbackMap(parsed);
      }
    } catch (error) {
      console.error("피드백 캐시 로드 실패:", error);
    }
  }, [currentMakerId]);

  // 선택된 히스토리가 바뀔 때, 캐시에 피드백이 있으면 바로 반영
  useEffect(() => {
    if (!currentHistoryId) return;

    const cachedFeedback = historyFeedbackMap[currentHistoryId];
    if (cachedFeedback !== undefined) {
      setResultFeedback(cachedFeedback);
    }
  }, [currentHistoryId, historyFeedbackMap]);

  useEffect(() => {
    const title = selectedPrompt?.title ?? "";
    const content = selectedPrompt?.content ?? "";

    setPromptTitle(title);
    setPromptContent(content);
    setCurrentMakerId(selectedPrompt?.makerId ?? null);

    // 선택된 메이커가 바뀔 때, 마지막 실행 결과도 함께 반영
    setResultType(selectedPrompt?.resultType ?? null);
    setResultImageUrl(selectedPrompt?.resultImageUrl ?? null);
    setResultText(selectedPrompt?.resultText ?? null);

    // 기존 이미지 URL 추출 (서버에서 받은 이미지들)
    let urls = [];
    let serverImages = [];
    if (selectedPrompt?.images && Array.isArray(selectedPrompt.images)) {
      urls = selectedPrompt.images
        .map((img) => img.imageUrl || img.url)
        .filter(Boolean);

      // 서버 이미지를 attachedImages 형식으로 변환
      serverImages = selectedPrompt.images
        .map((img) => ({
          id: img.imageId || Date.now() + Math.random(),
          imageUrl: img.imageUrl || img.url,
          isServerImage: true,
        }))
        .filter((img) => img.imageUrl);

      setExistingImageUrls(urls);
      setAttachedImages(serverImages); // 서버 이미지를 attachedImages에 추가
    } else {
      setExistingImageUrls([]);
      setAttachedImages([]);
    }

    // 이전 값 초기화
    // 초기 로드가 아닌 경우에만 업데이트 (사용자가 다른 메이커를 선택한 경우)
    if (!isInitialLoadRef.current) {
      prevValuesRef.current = {
        title,
        content,
        imageUrls: urls,
        newImageCount: 0,
      };
    } else {
      // 초기 로드 시에는 prevValuesRef를 현재 값으로 설정하되,
      // 다음 렌더링부터는 변경사항을 감지할 수 있도록 플래그 해제
      isInitialLoadRef.current = false;
      prevValuesRef.current = {
        title,
        content,
        imageUrls: urls,
        newImageCount: 0,
      };
    }

    setUpgrades([]);
    setLatestUpgradeId(null);
  }, [selectedPrompt]);

  // 2초마다 자동 저장
  useEffect(() => {
    // makerId가 없으면 저장하지 않음 (새 메이커는 먼저 생성되어야 함)
    if (!currentMakerId) {
      return;
    }

    // 저장 함수
    const performAutoSave = async () => {
      if (skipNextAutoSaveRef.current) {
        skipNextAutoSaveRef.current = false;
        return;
      }
      // 이미 저장 중이면 스킵
      if (isSavingRef.current) {
        return;
      }

      // 제목과 내용이 모두 비어있으면 저장하지 않음(예외 처리)
      if (!promptTitle.trim() && !promptContent.trim()) {
        return;
      }

      const titleToSave = promptTitle;
      const contentToSave = promptContent;

      // 전송해야 할 로컬 이미지 파일들
      const newImages = attachedImages.filter(
        (img) => img.file && !img.isServerImage
      );

      // 현재 attachedImages에 있는 서버 이미지 URL들만 추출
      // (삭제된 이미지는 attachedImages에 없으므로 자동으로 제외됨)
      const serverImageUrls = attachedImages
        .filter((img) => img.imageUrl || img.url || img.isServerImage)
        .map((img) => img.imageUrl || img.url)
        .filter(Boolean);

      // 유지할 이미지 URL = 현재 attachedImages에 있는 서버 이미지 URL들만
      // (existingImageUrls를 사용하지 않음 - 삭제된 이미지가 포함될 수 있음)
      const urlsToKeep = serverImageUrls;

      // 변경사항 체크
      const prev = prevValuesRef.current;
      const hasTitleChanged = prev.title !== promptTitle;
      const hasContentChanged = prev.content !== promptContent;

      // 이미지 URL 배열 비교 (순서 무관하게)
      const prevUrlsSet = new Set(prev.imageUrls);
      const currentUrlsSet = new Set(urlsToKeep);
      const hasImageUrlsChanged =
        prevUrlsSet.size !== currentUrlsSet.size ||
        [...currentUrlsSet].some((url) => !prevUrlsSet.has(url));

      // 새 이미지 개수 비교
      const hasNewImagesChanged = prev.newImageCount !== newImages.length;

      // 변경사항이 없으면 저장하지 않음
      if (
        !hasTitleChanged &&
        !hasContentChanged &&
        !hasImageUrlsChanged &&
        !hasNewImagesChanged
      ) {
        // 변경사항이 없을 때는 로그 출력하지 않음 (너무 많이 출력됨)
        return;
      }

      isSavingRef.current = true;

      try {
        // newImages를 파일 배열로 변환 (명세: file[])
        const newImageFiles = newImages.map((img) => img.file).filter(Boolean);

        const savedMaker = await autoSaveMaker(currentMakerId, {
          title: promptTitle,
          content: promptContent,
          existingImageUrls: urlsToKeep,
          newImages: newImageFiles, // 파일 배열로 전달
        });

        // 저장된 메이커 정보 업데이트
        if (savedMaker?.makerId) {
          setCurrentMakerId(savedMaker.makerId);
        }
        if (savedMaker?.title) {
          // 서버에서 반환된 제목으로 업데이트 (필요한 경우)
        }

        // 이전 값 업데이트 (저장 성공 후)
        prevValuesRef.current = {
          title: titleToSave,
          content: contentToSave,
          imageUrls: urlsToKeep,
          newImageCount: newImages.length,
        };
      } catch {
        // 자동 저장 실패는 사용자에게 알리지 않음 (백그라운드 작업)
      } finally {
        isSavingRef.current = false;
      }
    };

    // 2초마다 저장
    saveIntervalRef.current = setInterval(performAutoSave, 2000);

    // 컴포넌트 언마운트 시 interval 정리
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [
    promptTitle,
    promptContent,
    attachedImages,
    currentMakerId,
    existingImageUrls,
  ]);

  // 프롬프트 업그레이드 API 연동
  const handleUpgradeRequest = async ({
    selectedText,
    upgradeRequest,
    selectionRange,
    contentSnapshot,
  }) => {
    try {
      // 같은 선택 범위에 대한 기존 업그레이드가 있는지 확인
      const existingUpgrade = upgrades.find(
        (upgrade) =>
          upgrade.selectionRange &&
          upgrade.selectionRange.start === selectionRange.start &&
          upgrade.selectionRange.end === selectionRange.end
      );

      let responseData;
      let targetUpgradeId;

      if (existingUpgrade) {
        // 재업그레이드: 기존 업그레이드가 있으면 재업그레이드 API 사용
        // prevDirection은 originalDirection을 우선 사용 (새로고침 후에도 원래 direction 유지)
        // originalDirection이 없으면 direction 사용 (하위 호환성)
        const prevDirection =
          existingUpgrade.originalDirection ?? existingUpgrade.direction ?? "";

        responseData = await reupgradeMakerText({
          fullText: contentSnapshot || promptContent,
          selectedText: selectedText,
          prevDirection: prevDirection,
          prevResult: existingUpgrade.content,
          direction: upgradeRequest, // 사용자가 입력한 새로운 direction
        });

        // 기존 업그레이드 항목 갱신
        // originalDirection은 유지하고, direction만 업데이트
        setUpgrades((prev) =>
          prev.map((item) =>
            item.id === existingUpgrade.id
              ? {
                  ...item,
                  content: responseData.upgradedText,
                  originalText: responseData.originalText,
                  direction: responseData.direction,
                  // originalDirection은 첫 업그레이드 시의 값 유지
                  originalDirection:
                    existingUpgrade.originalDirection || responseData.direction,
                }
              : item
          )
        );
        targetUpgradeId = existingUpgrade.id;
      } else {
        // 첫 업그레이드: 기존 업그레이드가 없으면 새 업그레이드 API 사용
        responseData = await upgradeMakerText({
          fullText: contentSnapshot || promptContent,
          selectedText: selectedText,
          direction: upgradeRequest,
        });

        // API 응답을 업그레이드 카드 형식으로 변환
        const newUpgrade = {
          id: Date.now(), // 임시 ID (실제로는 서버에서 받아야 함)
          content: responseData.upgradedText,
          originalText: responseData.originalText,
          direction: responseData.direction,
          originalDirection: responseData.direction, // 첫 업그레이드 시의 direction 보존
          isApplied: false,
          selectionRange,
          contentSnapshot,
        };

        // 기존 업그레이드 목록에 추가
        setUpgrades((prev) => [...prev, newUpgrade]);
        targetUpgradeId = newUpgrade.id;
      }

      setLatestUpgradeId(targetUpgradeId);
    } catch (error) {
      console.error("텍스트 업그레이드 실패:", error);

      // 에러 처리
      let errorMessage = "텍스트 업그레이드에 실패했습니다.";
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

      alert(errorMessage);
    }
  };

  // 업그레이드 수락
  const handleAcceptUpgrade = (upgradeId) => {
    setUpgrades((prev) => {
      const target = prev.find((upgrade) => upgrade.id === upgradeId);
      if (!target) {
        return prev;
      }

      if (target.selectionRange) {
        const { start, end } = target.selectionRange;
        if (typeof start === "number" && typeof end === "number") {
          setPromptContent((currentContent) => {
            const before = currentContent.slice(0, start);
            const after = currentContent.slice(end);
            const newContent = `${before}${target.content}${after}`;

            // 삽입된 텍스트 위치 저장 (하이라이트용)
            const insertedStart = start;
            const insertedEnd = start + target.content.length;
            setInsertedTextRange({ start: insertedStart, end: insertedEnd });

            return newContent;
          });
        }
      }

      // 즉시 제거
      return prev.filter((upgrade) => upgrade.id !== upgradeId);
    });

    // 완료되어 오버레이 효과 제거
    if (latestUpgradeId === upgradeId) {
      setLatestUpgradeId(null);
    }
  };

  // 업그레이드 취소
  const handleCancelUpgrade = (upgradeId) => {
    setUpgrades((prev) => prev.filter((upgrade) => upgrade.id !== upgradeId));

    if (latestUpgradeId === upgradeId) {
      setLatestUpgradeId(null);
    }
  };

  // 업그레이드 아래에 삽입
  const handleEditUpgrade = (upgradeId) => {
    const target = upgrades.find((upgrade) => upgrade.id === upgradeId);
    if (!target) return;

    if (target.selectionRange) {
      const { end } = target.selectionRange;
      if (typeof end === "number") {
        setPromptContent((currentContent) => {
          const before = currentContent.slice(0, end);
          const after = currentContent.slice(end);
          // 선택된 텍스트 다음에 줄바꿈과 함께 업그레이드된 텍스트 삽입
          const insertedText = `\n${target.content}`;
          const newContent = `${before}${insertedText}${after}`;

          // 삽입된 텍스트 위치 저장 (하이라이트용)
          const insertedStart = end;
          const insertedEnd = end + insertedText.length;
          setInsertedTextRange({ start: insertedStart, end: insertedEnd });

          return newContent;
        });
      }
    }

    // 업그레이드 제거
    setUpgrades((prev) => prev.filter((upgrade) => upgrade.id !== upgradeId));

    if (latestUpgradeId === upgradeId) {
      setLatestUpgradeId(null);
    }
  };

  // 삽입된 텍스트 하이라이트 3초 후 제거
  useEffect(() => {
    if (insertedTextRange) {
      const timer = setTimeout(() => {
        setInsertedTextRange(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [insertedTextRange]);

  // 텍스트 재업그레이드 API 연동
  const handleReupgradeRequest = async () => {
    // 최신 업그레이드 찾기
    const latestUpgrade = upgrades.find(
      (upgrade) => upgrade.id === latestUpgradeId
    );

    if (!latestUpgrade) {
      // 최신 업그레이드가 없으면 첫 번째 업그레이드 사용
      if (upgrades.length === 0) {
        alert("재업그레이드할 업그레이드가 없습니다.");
        return;
      }
      const firstUpgrade = upgrades[0];
      await performReupgrade(firstUpgrade);
      return;
    }

    await performReupgrade(latestUpgrade);
  };

  const performReupgrade = async (upgrade) => {
    try {
      // 필수 필드 검증
      if (!upgrade) {
        throw new Error("업그레이드 정보가 없습니다.");
      }

      const fullText = upgrade.contentSnapshot || promptContent || "";
      const selectedText = upgrade.originalText || "";

      if (!fullText || !selectedText) {
        console.error("업그레이드 정보:", upgrade);
        throw new Error("필수 정보가 누락되었습니다.");
      }

      // API 호출
      // 재업그레이드: direction을 빈 문자열로 전송 (아무 생각 없이 문장 만들기)
      // prevDirection은 originalDirection을 우선 사용 (새로고침 후에도 원래 direction 유지)
      // originalDirection이 없으면 direction 사용 (하위 호환성)
      const prevDirection =
        upgrade.originalDirection ?? upgrade.direction ?? "";

      const responseData = await reupgradeMakerText({
        fullText: fullText,
        selectedText: selectedText,
        prevDirection: prevDirection,
        prevResult: upgrade.content,
        direction: "", // 빈 문자열로 전송
      });

      // 기존 업그레이드 항목 갱신 (새 항목 추가하지 않음)
      // originalDirection은 유지하고, direction만 업데이트
      setUpgrades((prev) =>
        prev.map((item) =>
          item.id === upgrade.id
            ? {
                ...item,
                content: responseData.upgradedText,
                originalText: responseData.originalText,
                direction: responseData.direction, // 새로고침 시 ""로 업데이트될 수 있음
                // originalDirection은 첫 업그레이드 시의 값 유지
                originalDirection:
                  upgrade.originalDirection || upgrade.direction,
              }
            : item
        )
      );
    } catch (error) {
      console.error("텍스트 재업그레이드 실패:", error);

      // 에러 처리
      let errorMessage = "텍스트 재업그레이드에 실패했습니다.";
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

      alert(errorMessage);
    }
  };

  return (
    <MakerPageWrapper>
      <SidePanel
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(false)}
        upgrades={upgrades}
        onAcceptUpgrade={handleAcceptUpgrade}
        onCancelUpgrade={handleCancelUpgrade}
        onEditUpgrade={handleEditUpgrade}
        onReupgrade={handleReupgradeRequest}
      />

      <MainPanel
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        promptContent={promptContent}
        onPromptContentChange={setPromptContent}
        promptTitle={promptTitle}
        onPromptTitleChange={setPromptTitle}
        attachedImages={attachedImages}
        onAttachedImagesChange={setAttachedImages}
        onUpgradeRequest={handleUpgradeRequest}
        onAcceptUpgrade={handleAcceptUpgrade}
        insertedTextRange={insertedTextRange}
        onCancelUpgrade={handleCancelUpgrade}
        onEditUpgrade={handleEditUpgrade}
        activeUpgradeId={latestUpgradeId}
        activeUpgrade={upgrades.find((u) => u.id === latestUpgradeId)}
        historyItems={historyItems}
        isResultModalOpen={isResultModalOpen}
        isResultLoading={isResultLoading}
        onRunPrompt={async () => {
          // 확장되지 않은 상태에서 PROMPT RUN을 누르면 ResultModal 표시
          if (!isResultPanelExpanded) {
            // RUN 실행
            if (!currentMakerId || !promptContent.trim()) {
              alert("메이커 ID 또는 프롬프트 내용이 없습니다.");
              return;
            }

            setIsResultLoading(true);
            try {
              // RUN 전에 한 번 더 강제 자동 저장을 실행
              try {
                const newImages = attachedImages.filter(
                  (img) => img.file && !img.isServerImage
                );

                const serverImageUrls = attachedImages
                  .filter((img) => img.imageUrl || img.url || img.isServerImage)
                  .map((img) => img.imageUrl || img.url)
                  .filter(Boolean);

                const urlsToKeep = serverImageUrls;

                const newImageFiles = newImages
                  .map((img) => img.file)
                  .filter(Boolean);

                await autoSaveMaker(currentMakerId, {
                  title: promptTitle,
                  content: promptContent,
                  existingImageUrls: urlsToKeep,
                  newImages: newImageFiles,
                });
              } catch (e) {
                console.error("RUN 직전 자동 저장 실패:", e);
              }

              const result = await runPrompt(currentMakerId, promptContent);

              // 결과 저장
              setResultType(result.resultType);
              setResultImageUrl(result.resultImageUrl || null);
              setResultText(result.resultText || null);
              setCurrentHistoryId(result.historyId);

              // 히스토리 목록 새로고침
              const histories = await getRunHistory(currentMakerId);
              const formattedHistories = histories.map((history) => ({
                id: history.historyId,
                title: history.title || `History ${history.historyId}`,
                createdAt: history.createdAt || null,
              }));
              setHistoryItems(formattedHistories);

              // 가장 최신 히스토리 선택 (인덱스 1)
              setCurrentHistoryIndex(1);

              // 최신 프롬프트에 대한 피드백 조회
              const cachedFeedback = historyFeedbackMap[result.historyId];
              if (cachedFeedback !== undefined) {
                setResultFeedback(cachedFeedback);
              } else {
                try {
                  const feedbackResponse = await getPromptFeedback(
                    currentMakerId
                  );
                  const feedbackText = feedbackResponse?.feedback ?? null;

                  setResultFeedback(feedbackText);
                  setHistoryFeedbackMap((prev) => {
                    const next = { ...prev, [result.historyId]: feedbackText };
                    try {
                      localStorage.setItem(
                        `makerFeedback:${currentMakerId}`,
                        JSON.stringify(next)
                      );
                    } catch (error) {
                      console.error("피드백 캐시 저장 실패:", error);
                    }
                    return next;
                  });
                } catch (e) {
                  console.error("피드백 조회 실패:", e);
                }
              }

              // ResultModal 표시
              setIsResultModalOpen(true);
            } catch (error) {
              console.error("프롬프트 실행 실패:", error);
              alert("프롬프트 실행에 실패했습니다.");
            } finally {
              setIsResultLoading(false);
            }
          }
        }}
        onOpenResultPanel={() => {
          // 히스토리 목록이 있거나 선택된 historyId가 있으면 열기
          if (historyItems.length > 0 || currentHistoryId) {
            setIsResultPanelOpen(true);
          }
        }}
        isResultPanelOpen={isResultPanelOpen}
        isResultPanelExpanded={isResultPanelExpanded}
      />

      <ResultPanel
        isOpen={isResultPanelOpen}
        onToggle={() => {
          setIsResultPanelOpen(false);
          setIsResultPanelExpanded(false); // 패널 닫을 때 확장 상태도 초기화
        }}
        onOpenModal={() => {
          setIsResultPanelOpen(false);
          setIsResultModalOpen(true);
        }}
        isSidebarOpen={isSidebarOpen}
        isResultPanelExpanded={isResultPanelExpanded}
        onExpandChange={setIsResultPanelExpanded}
        onRun={async () => {
          if (!currentMakerId || !promptContent.trim()) {
            alert("메이커 ID 또는 프롬프트 내용이 없습니다.");
            return;
          }

          setIsResultLoading(true);
          try {
            // RUN 전에 한 번 더 강제 자동 저장을 실행하여
            // 히스토리 스냅샷과 MainPanel 내용이 최대한 일치하도록 맞춘다.
            try {
              // 전송해야 할 로컬 이미지 파일들
              const newImages = attachedImages.filter(
                (img) => img.file && !img.isServerImage
              );

              // 현재 attachedImages에 있는 서버 이미지 URL들만 추출
              const serverImageUrls = attachedImages
                .filter((img) => img.imageUrl || img.url || img.isServerImage)
                .map((img) => img.imageUrl || img.url)
                .filter(Boolean);

              const urlsToKeep = serverImageUrls;

              const newImageFiles = newImages
                .map((img) => img.file)
                .filter(Boolean);

              await autoSaveMaker(currentMakerId, {
                title: promptTitle,
                content: promptContent,
                existingImageUrls: urlsToKeep,
                newImages: newImageFiles,
              });
            } catch (e) {
              // 강제 자동 저장 실패는 RUN 자체를 막지는 않는다.
              console.error("RUN 직전 자동 저장 실패:", e);
            }

            const result = await runPrompt(currentMakerId, promptContent);

            // 결과 저장
            setResultType(result.resultType);
            setResultImageUrl(result.resultImageUrl || null);
            setResultText(result.resultText || null);
            setCurrentHistoryId(result.historyId);

            // 히스토리 목록 새로고침
            const histories = await getRunHistory(currentMakerId);
            const formattedHistories = histories.map((history) => ({
              id: history.historyId,
              title: history.title || `History ${history.historyId}`,
              createdAt: history.createdAt || null,
            }));
            setHistoryItems(formattedHistories);

            // 가장 최신 히스토리 선택 (인덱스 1)
            setCurrentHistoryIndex(1);

            // 최신 프롬프트에 대한 피드백 조회 (히스토리별로 한 번만 호출)
            const cachedFeedback = historyFeedbackMap[result.historyId];
            if (cachedFeedback !== undefined) {
              setResultFeedback(cachedFeedback);
            } else {
              try {
                const feedbackResponse = await getPromptFeedback(
                  currentMakerId
                );
                const feedbackText = feedbackResponse?.feedback ?? null;

                setResultFeedback(feedbackText);
                setHistoryFeedbackMap((prev) => {
                  const next = { ...prev, [result.historyId]: feedbackText };
                  try {
                    localStorage.setItem(
                      `makerFeedback:${currentMakerId}`,
                      JSON.stringify(next)
                    );
                  } catch (error) {
                    console.error("피드백 캐시 저장 실패:", error);
                  }
                  return next;
                });
              } catch (e) {
                console.error("피드백 조회 실패:", e);
              }
            }
          } catch (error) {
            console.error("프롬프트 실행 실패:", error);
            alert("프롬프트 실행에 실패했습니다.");
          } finally {
            setIsResultLoading(false);
          }
        }}
        currentHistoryIndex={currentHistoryIndex}
        historyItems={historyItems}
        feedbackText={resultFeedback}
        onHistoryItemClick={async (item, index) => {
          if (!currentMakerId || !item.id) {
            console.error("메이커 ID 또는 히스토리 ID가 없습니다.");
            return;
          }

          try {
            const restored = await restoreHistory(currentMakerId, item.id);
            skipNextAutoSaveRef.current = true;
            // 메이커 내용 복원
            setPromptTitle(restored.snapshotTitle || "");
            setPromptContent(restored.snapshotContent || "");

            // 이미지 복원
            if (
              restored.snapshotImages &&
              Array.isArray(restored.snapshotImages)
            ) {
              const restoredImages = restored.snapshotImages.map((img) => ({
                id: Date.now() + Math.random(),
                imageUrl: img.imageUrl,
                isServerImage: true,
              }));
              setAttachedImages(restoredImages);
              setExistingImageUrls(
                restored.snapshotImages
                  .map((img) => img.imageUrl)
                  .filter(Boolean)
              );
            } else {
              setAttachedImages([]);
              setExistingImageUrls([]);
            }

            // 결과 표시
            setResultType(restored.resultType);
            setResultImageUrl(restored.resultImageUrl || null);
            setResultText(restored.resultText || null);
            setCurrentHistoryId(restored.historyId);
            setCurrentHistoryIndex(index + 1);

            // 복원된 프롬프트에 대한 피드백: 캐시 우선, 없으면 한 번만 조회
            const targetHistoryId = restored.historyId ?? item.id;
            const cachedFeedback = historyFeedbackMap[targetHistoryId];
            if (cachedFeedback !== undefined) {
              setResultFeedback(cachedFeedback);
            } else {
              try {
                const feedbackResponse = await getPromptFeedback(
                  currentMakerId
                );
                const feedbackText = feedbackResponse?.feedback ?? null;
                setResultFeedback(feedbackText);
                setHistoryFeedbackMap((prev) => {
                  const next = { ...prev, [targetHistoryId]: feedbackText };
                  try {
                    localStorage.setItem(
                      `makerFeedback:${currentMakerId}`,
                      JSON.stringify(next)
                    );
                  } catch (error) {
                    console.error("피드백 캐시 저장 실패:", error);
                  }
                  return next;
                });
              } catch (e) {
                console.error("피드백 조회 실패:", e);
              }
            }
          } catch (error) {
            console.error("히스토리 복원 실패:", error);
            alert("히스토리 복원에 실패했습니다.");
          }
        }}
        resultImageUrl={resultImageUrl}
        resultText={resultText}
        isResultLoading={isResultLoading}
        makerId={currentMakerId}
        historyId={currentHistoryId}
      />

      <ResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        onExpand={() => {
          setIsResultModalOpen(false);
          setIsResultPanelOpen(true);
        }}
        currentHistoryIndex={currentHistoryIndex}
        historyItems={historyItems}
        onHistoryItemClick={async (item, index) => {
          if (!currentMakerId || !item.id) {
            console.error("메이커 ID 또는 히스토리 ID가 없습니다.");
            return;
          }

          try {
            const restored = await restoreHistory(currentMakerId, item.id);
            skipNextAutoSaveRef.current = true;
            // 메이커 내용 복원
            setPromptTitle(restored.snapshotTitle || "");
            setPromptContent(restored.snapshotContent || "");

            // 이미지 복원
            if (
              restored.snapshotImages &&
              Array.isArray(restored.snapshotImages)
            ) {
              const restoredImages = restored.snapshotImages.map((img) => ({
                id: Date.now() + Math.random(),
                imageUrl: img.imageUrl,
                isServerImage: true,
              }));
              setAttachedImages(restoredImages);
              setExistingImageUrls(
                restored.snapshotImages
                  .map((img) => img.imageUrl)
                  .filter(Boolean)
              );
            } else {
              setAttachedImages([]);
              setExistingImageUrls([]);
            }

            // 결과 표시
            setResultType(restored.resultType);
            setResultImageUrl(restored.resultImageUrl || null);
            setResultText(restored.resultText || null);
            setCurrentHistoryId(restored.historyId);
            setCurrentHistoryIndex(index + 1);

            // 복원된 프롬프트에 대한 피드백: 캐시 우선, 없으면 한 번만 조회
            const targetHistoryId = restored.historyId ?? item.id;
            const cachedFeedback = historyFeedbackMap[targetHistoryId];
            if (cachedFeedback !== undefined) {
              setResultFeedback(cachedFeedback);
            } else {
              try {
                const feedbackResponse = await getPromptFeedback(
                  currentMakerId
                );
                const feedbackText = feedbackResponse?.feedback ?? null;
                setResultFeedback(feedbackText);
                setHistoryFeedbackMap((prev) => {
                  const next = { ...prev, [targetHistoryId]: feedbackText };
                  try {
                    localStorage.setItem(
                      `makerFeedback:${currentMakerId}`,
                      JSON.stringify(next)
                    );
                  } catch (error) {
                    console.error("피드백 캐시 저장 실패:", error);
                  }
                  return next;
                });
              } catch (e) {
                console.error("피드백 조회 실패:", e);
              }
            }
          } catch (error) {
            console.error("히스토리 복원 실패:", error);
            alert("히스토리 복원에 실패했습니다.");
          }
        }}
        resultImageUrl={resultImageUrl}
        resultText={resultText}
        feedbackText={resultFeedback}
        isResultLoading={isResultLoading}
        makerId={currentMakerId}
        historyId={currentHistoryId}
      />
    </MakerPageWrapper>
  );
}

const MakerPageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fdffff;
  position: relative;
  overflow-x: hidden;
`;
