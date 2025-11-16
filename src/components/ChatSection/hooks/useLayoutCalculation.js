import { useEffect, useRef, useState } from "react";

export const useLayoutCalculation = (droppedPrompt, attachedImages) => {
  const [previewHeightPx, setPreviewHeightPx] = useState(null);
  const [droppedPromptHeight, setDroppedPromptHeight] = useState(null);
  const [droppedPromptWidth, setDroppedPromptWidth] = useState(null);
  const promptPreviewRef = useRef(null);
  const imagesPreviewRef = useRef(null);
  const chatSendBoxRef = useRef(null);
  const chatSendAreaRef = useRef(null);
  const savedPromptHeightRef = useRef(null);

  // ChatSendBox 높이 측정
  useEffect(() => {
    const measure = () => {
      if (!chatSendBoxRef.current) return;
      const rect = chatSendBoxRef.current.getBoundingClientRect();
      if (!rect || !rect.height) return;
      savedPromptHeightRef.current = rect.height;
      setPreviewHeightPx((prev) =>
        typeof prev === "number" && Math.abs(prev - rect.height) <= 0.5
          ? prev
          : rect.height
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  // 이미지 미리보기 높이와 이미지 크기 설정
  useEffect(() => {
    if (!imagesPreviewRef.current) return;

    const updateHeight = () => {
      if (!imagesPreviewRef.current) return;

      // ChatSendBox와 동일한 높이 사용 (없으면 fallback)
      let heightToUsePx =
        typeof previewHeightPx === "number" && previewHeightPx > 0
          ? previewHeightPx
          : savedPromptHeightRef.current || 0;

      if ((!heightToUsePx || heightToUsePx <= 0) && chatSendBoxRef.current) {
        const rect = chatSendBoxRef.current.getBoundingClientRect();
        if (rect && rect.height) {
          heightToUsePx = rect.height;
        }
      }

      if (!heightToUsePx && attachedImages.length > 0) {
        // 프롬프트 카드가 없고 아직 높이를 모르는 경우 이미지 개수로 계산
        const gapPx = 8;
        const imageCount = attachedImages.length;
        let rows = imageCount <= 3 ? 1 : 2;
        const minImageSizePx = 80;
        heightToUsePx = minImageSizePx * rows + (rows - 1) * gapPx;
      }

      if (!heightToUsePx) {
        heightToUsePx = 150;
      }

      savedPromptHeightRef.current = heightToUsePx;

      // 이미지 영역 높이 고정
      const heightValue = `${heightToUsePx}px`;
      imagesPreviewRef.current.style.height = heightValue;
      imagesPreviewRef.current.style.minHeight = heightValue;
      imagesPreviewRef.current.style.maxHeight = heightValue;

      // 이미지가 있을 때만 그리드 크기 계산
      if (attachedImages.length > 0) {
        const gapPx = 8; // 0.5rem = 8px (디자인 기준)
        const gapBetweenPromptAndImages = 12; // 0.75rem = 12px
        const imageCount = attachedImages.length;
        const hasPrompt = !!promptPreviewRef.current;

        // 사용 가능한 width 계산
        let availableWidthPx = 0;
        if (chatSendAreaRef.current) {
          const sendAreaRect = chatSendAreaRef.current.getBoundingClientRect();
          const totalWidth = sendAreaRect.width;

          if (hasPrompt && promptPreviewRef.current) {
            const promptRect = promptPreviewRef.current.getBoundingClientRect();
            const promptWidth = promptRect.width;
            availableWidthPx =
              totalWidth - promptWidth - gapBetweenPromptAndImages;
          } else {
            availableWidthPx = totalWidth;
          }
        }

        const computeLayout = (count) => {
          if (hasPrompt) {
            if (count <= 1) return { columns: 1, rows: 1 };
            if (count === 2) return { columns: 2, rows: 1 };
            const columns = 3;
            const rows = Math.min(2, Math.max(1, Math.ceil(count / columns)));
            return { columns, rows };
          }
          if (count <= 1) return { columns: 1, rows: 1 };
          if (count === 2) return { columns: 2, rows: 1 };
          const columns = 3;
          const rows = Math.min(2, Math.max(1, Math.ceil(count / columns)));
          return { columns, rows };
        };

        const { columns, rows } = computeLayout(imageCount);

        // 높이 기반 이미지 크기 계산
        const rowSizePx =
          rows > 0
            ? (heightToUsePx - (rows - 1) * gapPx) / rows
            : heightToUsePx;

        // width 기반 이미지 크기 계산
        let widthBasedSizePx = 0;
        if (availableWidthPx > 0 && columns > 0) {
          widthBasedSizePx =
            (availableWidthPx - (columns - 1) * gapPx) / columns;
        }

        // 높이와 width 중 작은 값을 사용하여 정사각형 유지
        const imageSizePx = Math.max(
          0,
          Math.min(
            rowSizePx,
            widthBasedSizePx > 0 ? widthBasedSizePx : rowSizePx
          )
        );

        imagesPreviewRef.current.style.setProperty(
          "--grid-template-columns",
          `repeat(${columns || 1}, ${imageSizePx}px)`
        );
        imagesPreviewRef.current.style.setProperty(
          "--grid-template-rows",
          `repeat(${rows || 1}, ${imageSizePx}px)`
        );

        imagesPreviewRef.current.style.setProperty(
          "--image-size",
          `${imageSizePx}px`
        );

        if (
          typeof previewHeightPx !== "number" ||
          Math.abs(previewHeightPx - heightToUsePx) > 0.5
        ) {
          setPreviewHeightPx(heightToUsePx);
        }
      } else {
        imagesPreviewRef.current.style.removeProperty(
          "--grid-template-columns"
        );
        imagesPreviewRef.current.style.removeProperty("--grid-template-rows");
        imagesPreviewRef.current.style.removeProperty("--image-size");
      }
    };

    // DOM 렌더링 완료 후 높이 측정
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateHeight();
      });
    });
  }, [droppedPrompt, attachedImages, previewHeightPx]);

  // DroppedPromptPreview의 실제 높이 측정
  useEffect(() => {
    if (droppedPrompt && promptPreviewRef.current) {
      const measureDroppedPromptHeight = () => {
        if (promptPreviewRef.current) {
          const rect = promptPreviewRef.current.getBoundingClientRect();
          if (rect && rect.height > 0) {
            setDroppedPromptHeight(rect.height);
          }
          if (rect && rect.width > 0) {
            setDroppedPromptWidth(rect.width);
          }
        }
      };

      // DOM 렌더링 완료 후 측정
      requestAnimationFrame(() => {
        requestAnimationFrame(measureDroppedPromptHeight);
      });
    } else {
      setDroppedPromptHeight(null);
      setDroppedPromptWidth(null);
    }
  }, [droppedPrompt, previewHeightPx]); // previewHeightPx가 변경될 때도 재측정

  return {
    previewHeightPx,
    droppedPromptHeight,
    droppedPromptWidth,
    promptPreviewRef,
    imagesPreviewRef,
    chatSendBoxRef,
    chatSendAreaRef,
  };
};
