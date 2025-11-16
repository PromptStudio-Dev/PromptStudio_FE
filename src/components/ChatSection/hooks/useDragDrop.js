import { useState, useEffect } from "react";

export const useDragDrop = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPromptDragging, setIsPromptDragging] = useState(false);

  useEffect(() => {
    const handlePromptDragStartEvent = () => setIsPromptDragging(true);
    const handlePromptDragEndEvent = () => {
      setIsPromptDragging(false);
      setIsDragOver(false);
    };

    window.addEventListener(
      "prompt-card-dragstart",
      handlePromptDragStartEvent
    );
    window.addEventListener("prompt-card-dragend", handlePromptDragEndEvent);

    return () => {
      window.removeEventListener(
        "prompt-card-dragstart",
        handlePromptDragStartEvent
      );
      window.removeEventListener(
        "prompt-card-dragend",
        handlePromptDragEndEvent
      );
    };
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDrop = (setDroppedPrompt) => (event) => {
    event.preventDefault();
    setIsDragOver(false);
    setIsPromptDragging(false);

    try {
      const rawData = event.dataTransfer.getData("application/json");
      if (!rawData) return;

      const parsed = JSON.parse(rawData);
      if (parsed && typeof parsed === "object") {
        setDroppedPrompt(parsed);
      }
    } catch (error) {
      console.error("드래그 데이터 파싱에 실패했습니다.", error);
    }
  };

  const isHighlighted = isPromptDragging || isDragOver;

  return {
    isDragOver,
    isPromptDragging,
    isHighlighted,
    handleDragOver,
    handleDrop,
  };
};
