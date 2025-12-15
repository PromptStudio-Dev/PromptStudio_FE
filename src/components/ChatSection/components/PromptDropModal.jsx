import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import styled from "styled-components";

import { useImageAttachment } from "../hooks/useImageAttachment";
import { useCopyModal } from "../../../contexts/CopyModalContext";

// 백엔드에서 fields 데이터를 제공하므로 간소화된 구조 사용
const dummyPromptData = {
  text: `주인공 : [남주와 여주 스타일]

제품 : [제품]
네이버 웹툰 스타일 4컷 만화를 스토리에 맞게 그려줘. 전체적으로 밝고 경쾌한 색감, 자연광

조명, 제품이 부각되는 장면을 1장면 이상 추가하고, 여자와 남자의 클로즈업 샷을 번갈아 가
면서 촬영해줘. 그리고 탑다운 장면으로 마무리하도록 해줘. 부드럽고 샤프한 이미지의 남자

스토리 : [스토리]

네이버 웹툰 스타일 4컷 만화를 [빈칸]에 맞게 그려줘. 전체적으로 밝고 경쾌한 색감, 자연광
조명, 제품이 부각되는 장면을 1장면 이상 추가하고, 여자와 [빈칸2]의 클로즈업 샷을 번갈아 가
면서 촬영해줘. 그리고 탑다운 장면으로 마무리하도록 해줘. 부드럽고 샤프한 이미지의 남자
주인공과 약간 포동포동한 여주 스타일. 그리고 옷은 청바지와 [빈칸3] 셔츠`,
  fields: [
    { name: "남주와 여주 스타일" },
    { name: "제품" },
    { name: "스토리" },
    { name: "빈칸" },
    { name: "빈칸2" },
    { name: "빈칸3" },
  ],
};

// 💡 백엔드 응답 형식으로 더미 데이터를 수정해서 실험해보세요!
// 백엔드에서 제공하는 형식: { text: "...", fields: [{ name: "..." }, ...] }
/*
const dummyPromptData = {
  text: `제목: [제목], 장르: [장르], 주인공: [주인공 이름]의 이야기를 써줘`,
  fields: [
    { name: "제목" },
    { name: "장르" },
    { name: "주인공 이름" }
  ]
};
*/

export default function PromptDropModal({
  isOpen,
  onClose,
  promptData,
  onApply,
  initialValues,
  initialImages,
}) {
  const [inputValues, setInputValues] = useState({});
  const [currentPromptText, setCurrentPromptText] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [invalidFieldName, setInvalidFieldName] = useState(null);
  const [fieldNameMaxWidth, setFieldNameMaxWidth] = useState(0);
  const [isImageMissing, setIsImageMissing] = useState(false);
  const contentContainerRef = useRef(null);
  const segmentRefs = useRef({});
  const inputFieldRefs = useRef({});
  const fieldNameRefs = useRef({});
  const imageFieldRef = useRef(null);

  const {
    attachedImages: modalImages,
    fileInputRef: modalFileInputRef,
    handleImageAttachClick: handleModalImageAttachClick,
    handleImageSelect: handleModalImageSelect,
    handleImageRemove: handleModalImageRemove,
    clearImages: clearModalImages,
    replaceImagesWithFiles: replaceModalImagesWithFiles,
  } = useImageAttachment();
  const hasAppliedInitialImagesRef = useRef(false);
  const { showCopyModal } = useCopyModal();

  const fieldNamesKey = useMemo(() => {
    if (!promptData?.fields?.length && !dummyPromptData.fields?.length) {
      return "";
    }
    const sourceFields = promptData?.fields?.length
      ? promptData.fields
      : dummyPromptData.fields;
    return sourceFields.map((field) => field.name).join("|");
  }, [promptData]);

  // promptData가 없거나 텍스트가 없으면 더미 데이터 사용
  const activePromptData =
    promptData && promptData.text ? promptData : dummyPromptData;
  const isImageRequired = Boolean(promptData?.imageRequired);

  // 백엔드에서 제공한 필드 정보로 inputValues 초기화
  useEffect(() => {
    if (activePromptData?.text && activePromptData?.fields) {
      const fields = {};
      activePromptData.fields.forEach((field) => {
        fields[field.name] = (initialValues && initialValues[field.name]) || "";
      });
      setInputValues(fields);
      setCurrentPromptText(activePromptData.text);
    }
  }, [activePromptData, initialValues]);

  useEffect(() => {
    if (!isOpen) {
      clearModalImages();
      setIsImageMissing(false);
      hasAppliedInitialImagesRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (hasAppliedInitialImagesRef.current) return;

    if (Array.isArray(initialImages) && initialImages.length > 0) {
      const files = initialImages
        .map((img) => img?.file)
        .filter((file) => !!file);
      if (files.length > 0) {
        replaceModalImagesWithFiles(files);
        hasAppliedInitialImagesRef.current = true;
      }
    } else {
      clearModalImages();
      hasAppliedInitialImagesRef.current = true;
    }
  }, [isOpen, initialImages, replaceModalImagesWithFiles, clearModalImages]);

  const handleInputChange = (fieldName, value) => {
    setInputValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (invalidFieldName === fieldName && value.trim() !== "") {
      setInvalidFieldName(null);
    }
  };

  // inputValues가 변경될 때마다 텍스트 업데이트
  useEffect(() => {
    if (activePromptData?.text && activePromptData?.fields) {
      let updatedText = activePromptData.text;
      Object.entries(inputValues).forEach(([fieldName, value]) => {
        updatedText = updatedText.replace(
          new RegExp(`\\[${fieldName}\\]`, "g"),
          value || `[${fieldName}]`
        );
      });
      setCurrentPromptText(updatedText);
    }
  }, [inputValues, activePromptData]);

  useEffect(() => {
    if (!isOpen) {
      setFieldNameMaxWidth(0);
      fieldNameRefs.current = {};
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !activePromptData?.fields?.length) return;

    const frameId = requestAnimationFrame(() => {
      const widths = activePromptData.fields.map((field) => {
        const el = fieldNameRefs.current[field.name];
        return el?.offsetWidth || 0;
      });
      if (isImageRequired && imageFieldRef.current) {
        widths.push(imageFieldRef.current.offsetWidth || 0);
      }
      const maxWidth = widths.length ? Math.max(...widths) : 0;
      setFieldNameMaxWidth(maxWidth);
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, fieldNamesKey, activePromptData?.fields, isImageRequired]);

  const renderedPromptSegments = useMemo(() => {
    if (!activePromptData?.text || !activePromptData?.fields) {
      return null;
    }

    segmentRefs.current = {};

    const baseText = activePromptData.text;
    const segments = [];
    const placeholderRegex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = placeholderRegex.exec(baseText)) !== null) {
      const matchIndex = match.index;
      const fieldName = match[1];

      if (matchIndex > lastIndex) {
        segments.push({
          type: "text",
          content: baseText.slice(lastIndex, matchIndex),
        });
      }

      const value = inputValues[fieldName] || "";
      let segmentType = value ? "filled" : "placeholder";
      if (focusedField === fieldName) {
        segmentType = "active";
      }

      segments.push({
        type: segmentType,
        content: value || `[${fieldName}]`,
        fieldName,
      });

      lastIndex = placeholderRegex.lastIndex;
    }

    if (lastIndex < baseText.length) {
      segments.push({
        type: "text",
        content: baseText.slice(lastIndex),
      });
    }

    return segments;
  }, [activePromptData, inputValues, focusedField]);

  useEffect(() => {
    if (!focusedField) return;

    const container = contentContainerRef.current;
    const target = segmentRefs.current[focusedField];

    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offset = targetRect.top - containerRect.top;
      const scrollAmount =
        offset - container.clientHeight / 2 + target.offsetHeight / 2;

      container.scrollTo({
        top: container.scrollTop + scrollAmount,
        behavior: "smooth",
      });
    }
  }, [focusedField, renderedPromptSegments]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>프롬프트 사용하기</Title>
        <Subtitle>프롬프트 내용을 채우고 실행결과를 확인해보세요.</Subtitle>
        <ContentRow>
          <ContentContainer ref={contentContainerRef}>
            {renderedPromptSegments
              ? renderedPromptSegments.map((segment, index) => (
                  <PromptTextPart
                    key={`${segment.type}-${index}`}
                    $type={segment.type}
                    ref={
                      segment.fieldName
                        ? (el) => {
                            if (el) {
                              segmentRefs.current[segment.fieldName] = el;
                            }
                          }
                        : null
                    }
                  >
                    {segment.content}
                  </PromptTextPart>
                ))
              : currentPromptText}
          </ContentContainer>
          {(activePromptData?.fields?.length > 0 || isImageRequired) && (
            <InputSection>
              {activePromptData?.fields?.map((field) => {
                const isEmpty =
                  !inputValues[field.name] ||
                  inputValues[field.name].trim() === "";
                return (
                  <InputRow key={field.name}>
                    <FieldName
                      ref={(el) => {
                        if (el) {
                          fieldNameRefs.current[field.name] = el;
                        }
                      }}
                      $fixedWidth={fieldNameMaxWidth}
                    >
                      <RequiredMark $isVisible={isEmpty}>*</RequiredMark>
                      {`[${field.name}]`}
                    </FieldName>
                    <FieldInput
                      type="text"
                      value={inputValues[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      ref={(el) => {
                        if (el) {
                          inputFieldRefs.current[field.name] = el;
                        }
                      }}
                      $isInvalid={invalidFieldName === field.name}
                      placeholder={`${field.name}을(를) 입력하세요`}
                    />
                  </InputRow>
                );
              })}

              {isImageRequired && (
                <ImageBlock>
                  <ImageBlockTitle
                    ref={(el) => {
                      imageFieldRef.current = el;
                    }}
                  >
                    <RequiredMark
                      $isVisible={isImageMissing || modalImages.length === 0}
                    >
                      *
                    </RequiredMark>
                    이미지
                  </ImageBlockTitle>
                  <HiddenImageInput
                    type="file"
                    accept="image/*"
                    multiple
                    ref={modalFileInputRef}
                    onChange={(event) => {
                      handleModalImageSelect(event);
                      setIsImageMissing(false);
                    }}
                  />
                  <ImageArea $isInvalid={isImageMissing}>
                    <ImagePreviewGrid>
                      {modalImages.map((image) => (
                        <ImagePreviewItem key={image.id}>
                          <ImageThumbnail
                            src={image.preview}
                            alt="첨부 이미지 미리보기"
                          />
                          <ImageRemoveButton
                            type="button"
                            onClick={() => handleModalImageRemove(image.id)}
                          >
                            ×
                          </ImageRemoveButton>
                        </ImagePreviewItem>
                      ))}
                      {modalImages.length < 6 && (
                        <ImageUploadArea
                          $isInvalid={isImageMissing}
                          onClick={handleModalImageAttachClick}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const files = Array.from(
                              e.dataTransfer.files
                            ).filter((file) => file.type.startsWith("image/"));
                            if (files.length > 0) {
                              const dataTransfer = new DataTransfer();
                              files.forEach((file) =>
                                dataTransfer.items.add(file)
                              );
                              const event = new Event("change", {
                                bubbles: true,
                              });
                              Object.defineProperty(event, "target", {
                                value: { files: dataTransfer.files },
                                enumerable: true,
                              });
                              handleModalImageSelect(event);
                              setIsImageMissing(false);
                            }
                          }}
                        >
                          <PlusIcon $isInvalid={isImageMissing}>+</PlusIcon>
                        </ImageUploadArea>
                      )}
                    </ImagePreviewGrid>
                  </ImageArea>
                </ImageBlock>
              )}
            </InputSection>
          )}
        </ContentRow>
        <ButtonSection>
          <ActionButton
            type="button"
            onClick={() => {
              if (activePromptData?.fields) {
                const missingField = activePromptData.fields.find(
                  (field) =>
                    !inputValues[field.name] ||
                    inputValues[field.name].trim() === ""
                );

                if (missingField) {
                  setInvalidFieldName(missingField.name);
                  const target = inputFieldRefs.current[missingField.name];
                  if (target) {
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    target.focus();
                  }
                  return;
                }
              }

              if (isImageRequired && modalImages.length === 0) {
                setIsImageMissing(true);
                showCopyModal("이미지를 첨부해야 합니다!");
                return;
              }

              const payload = {
                filledPromptText: currentPromptText,
                fieldValues: inputValues,
                originalPromptText: activePromptData.text,
                fields: activePromptData.fields,
                images: modalImages.map(({ file }) => file),
              };

              console.log("[PromptDropModal] 적용 데이터:", payload);
              onApply?.(payload);
            }}
          >
            프롬프트 적용
          </ActionButton>
        </ButtonSection>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 6.94vh; /* 헤더 높이 */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh; /* 중앙보다 살짝 위로 */
  z-index: 2000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 65vw;
  height: 70vh;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  padding: 2.5rem 3.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.h2`
  color: #000;
  font-family: Pretendard;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #000;
  font-family: Pretendard;
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin: 0;
  margin-top: 1.19rem;
`;

const ContentRow = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  min-height: 0;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ContentContainer = styled.div`
  flex: 1;
  height: 100%;
  border-radius: 1rem;
  border: 2px solid var(--Light-blue, #49d8ff);
  background: #f7fcff;
  padding: 1.25rem 2rem;
  font-size: 1.1875rem;
  white-space: pre-wrap;
  overflow-y: auto;
  color: #000;
  line-height: 1.5;
`;

const PromptTextPart = styled.span`
  display: inline;
  white-space: pre-wrap;
  transition: all 0.2s ease;

  ${({ $type }) => {
    switch ($type) {
      case "active":
        return `
        background-color: rgba(73, 216, 255, 0.2);
          border-radius: 0.25rem;
          padding: 0.1rem 0.25rem;
          font-weight: 600;
          color: #00324d;
        
        `;
      case "filled":
        return `
        background-color: rgba(73, 216, 255, 0.35);
          border-radius: 0.35rem;
          padding: 0.1rem 0.25rem;
          border-bottom: 2px solid #00aeff;
          font-weight: 600;
          color: #00324d;
        `;
      case "placeholder":
        return `
          color: #7a7a7a;
          // font-style: italic;
          border-bottom: 1px dashed rgba(255, 193, 7, 0.8);
        `;
      default:
        return `
          color: #000;
        `;
    }
  }}
`;

const InputSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
`;

const InputRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.69rem;
`;

const FieldName = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: left;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  position: relative;
  flex: 0 0 auto;
  padding-left: 0.7rem;
  width: ${({ $fixedWidth }) => ($fixedWidth ? `${$fixedWidth}px` : "auto")};
  max-width: ${({ $fixedWidth }) =>
    $fixedWidth ? `${$fixedWidth}px` : "none"};
  box-sizing: border-box;
`;

const RequiredMark = styled.span`
  position: absolute;
  left: 0rem;
  display: inline-block;
  width: 0.75rem;
  text-align: left;
  color: ${({ $isVisible }) => ($isVisible ? "#49d8ff" : "transparent")};
  font-weight: 600;
  text-align: center;
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 0.75rem 1.25rem;
  border: 1px solid ${({ $isInvalid }) => ($isInvalid ? "#ff6b6b" : "#a6a6a6")};
  border-radius: 0.5rem;
  font-size: 1rem;
  flex: 1;
  font-family: Pretendard;
  color: #000;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $isInvalid }) => ($isInvalid ? "#ff6b6b" : "#00aeff")};
    box-shadow: ${({ $isInvalid }) =>
      $isInvalid
        ? "0 0 0 2px rgba(255, 107, 107, 0.2)"
        : "0 0 0 2px rgba(73, 216, 255, 0.1)"};
  }
`;

const HiddenImageInput = styled.input`
  display: none;
`;

const ImageBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.69rem;
  width: 100%;
`;

const ImageBlockTitle = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: left;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  position: relative;
  flex: 0 0 auto;
  padding-left: 0.7rem;
  box-sizing: border-box;
`;

const ImageArea = styled.div`
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #d9ecff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const ImageThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageRemoveButton = styled.button`
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ImageUploadArea = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 75%;
  position: relative;
  border: 1px dashed ${({ $isInvalid }) => ($isInvalid ? "#ff6b6b" : "#616161")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background-color: #fff;

  &:hover {
    border-color: ${({ $isInvalid }) => ($isInvalid ? "#ff6b6b" : "#616161")};
  }
`;

const PlusIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: #616161;
  font-weight: 300;
  line-height: 1;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  width: 65%;
  margin-top: auto;
  padding-left: 1.75rem;
`;

const ActionButton = styled.button`
  padding: 0.62rem 6rem;
  margin-top: 2rem;
  background-color: #49d8ff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: Pretendard;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #00aeff;
  }

  &:active {
    background-color: #0088cc;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 10;

  &:hover {
    color: #000;
  }
`;
