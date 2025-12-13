import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const CopyModalContext = createContext(null);

export function CopyModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("복사가 완료 되었습니다");
  const timeoutRef = useRef(null);

  const showCopyModal = useCallback((customMessage) => {
    // 이전 타이머가 있으면 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (customMessage) {
      setMessage(customMessage);
    } else {
      setMessage("복사가 완료 되었습니다");
    }
    setIsOpen(true);
    // 2초 후 자동으로 닫기
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  }, []);

  const closeCopyModal = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  }, []);

  return (
    <CopyModalContext.Provider
      value={{ isOpen, message, showCopyModal, closeCopyModal }}
    >
      {children}
    </CopyModalContext.Provider>
  );
}

export function useCopyModal() {
  const context = useContext(CopyModalContext);
  if (!context) {
    throw new Error("useCopyModal must be used within a CopyModalProvider");
  }
  return context;
}
