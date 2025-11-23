import { useRef, useEffect } from "react";

export const useTextareaAutoResize = () => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = 11 * 16; // 11rem -> px
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  const handleTextareaChange = () => {
    adjustHeight();
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  return {
    textareaRef,
    handleTextareaChange,
  };
};
