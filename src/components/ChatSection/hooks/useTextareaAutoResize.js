import { useRef, useEffect } from "react";

export const useTextareaAutoResize = () => {
  const textareaRef = useRef(null);

  const getInitialHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return 5.5 * 16; // fallback

    // placeholder가 있을 때의 실제 높이 측정
    const currentValue = textarea.value;
    textarea.value = "";
    textarea.style.height = "auto";
    const initialHeight = textarea.scrollHeight;
    textarea.value = currentValue;
    return initialHeight;
  };

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 높이를 초기화하여 scrollHeight를 정확히 계산
    textarea.style.height = "auto";

    // scrollHeight를 가져와서 높이 설정
    const scrollHeight = textarea.scrollHeight;
    const initialHeight = getInitialHeight(); // placeholder가 있을 때의 실제 높이
    const maxHeight = 11 * 16; // 11rem을 px로 변환 (1rem = 16px) - 최대 높이

    // 텍스트가 한 줄에 들어가면 초기 높이 유지, 여러 줄이 되면 scrollHeight에 맞춰 조정
    if (scrollHeight <= initialHeight) {
      textarea.style.height = `${initialHeight}px`;
    } else if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`;
    } else {
      textarea.style.height = `${maxHeight}px`;
    }
  };

  // 초기 렌더링 시 높이 설정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 초기 높이를 실제 측정된 값으로 설정
      const initialHeight = getInitialHeight();
      textarea.style.height = `${initialHeight}px`;
    }
  }, []);

  return {
    textareaRef,
    handleTextareaChange,
  };
};
