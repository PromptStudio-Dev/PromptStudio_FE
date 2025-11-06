/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styled from "styled-components";
import CategoryTag from "../HubPage/CategoryTag";
import businessIcon from "../HubPage/assets/businessIcon.svg";
import employeeIcon from "../HubPage/assets/employeeIcon.svg";
import investIcon from "../HubPage/assets/investIcon.svg";
import designIcon from "../HubPage/assets/designIcon.svg";
import normalIcon from "../HubPage/assets/normalIcon.svg";
import studyIcon from "../HubPage/assets/studyIcon.svg";
import lockIcon from "./assets/lockIcon.svg";
import unlockIcon from "./assets/unlockIcon.svg";
import NextButtonIconImage from "./assets/nextButtonIcon.svg";

export default function OtherInputPage({ onPrev, onRegister }) {
  const [selectedAi, setSelectedAi] = useState("Chat GPT");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScope, setSelectedScope] = useState("");

  const aiOptions = [
    "Chat GPT",
    "Gemini",
    "Perplexity",
    "DALL-E",
    "Midjourney",
    "v0",
    "기타",
  ];

  const categories = [
    { name: "전체", img: "" },
    { name: "비즈니스", img: businessIcon },
    { name: "취업", img: employeeIcon },
    { name: "개발", img: investIcon },
    { name: "디자인", img: designIcon },
    { name: "일상", img: normalIcon },
    { name: "학업", img: studyIcon },
  ];

  const handleAiChange = (e) => {
    setSelectedAi(e.target.value);
  };

  return (
    <OtherInputPageWrapper>
      <AiNameSection>
        <TitleText>사용한 (추천하는) AI </TitleText>
        <AiSelectSection>
          {aiOptions.map((ai) => (
            <RadioOption key={ai} onClick={() => setSelectedAi(ai)}>
              <RadioInput
                type="radio"
                id={ai}
                name="ai-selection"
                value={ai}
                checked={selectedAi === ai}
                onChange={handleAiChange}
              />
              <CustomRadioButton $isChecked={selectedAi === ai} />
              <RadioLabel htmlFor={ai}>{ai}</RadioLabel>
            </RadioOption>
          ))}
        </AiSelectSection>
      </AiNameSection>
      <CategoryInputSection>
        <TitleText>카테고리 </TitleText>
        <CategoryList>
          {categories.map((category) => (
            <CategoryTag
              key={category.name}
              name={category.name}
              img={category.img}
              isSelected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </CategoryList>
      </CategoryInputSection>
      <ScopeInputSection>
        <TitleText>공개 범위</TitleText>
        <ScopeList>
          <ScopeItem
            $isSelected={selectedScope === "공개"}
            onClick={() => setSelectedScope("공개")}
          >
            <ScopeIcon
              src={unlockIcon}
              alt="공개"
              $isSelected={selectedScope === "공개"}
            />
            <ScopeItemText $isSelected={selectedScope === "공개"}>
              공개
            </ScopeItemText>
          </ScopeItem>
          <ScopeItem
            $isSelected={selectedScope === "비공개"}
            onClick={() => setSelectedScope("비공개")}
          >
            <ScopeIcon
              src={lockIcon}
              alt="비공개"
              $isSelected={selectedScope === "비공개"}
            />
            <ScopeItemText $isSelected={selectedScope === "비공개"}>
              비공개
            </ScopeItemText>
          </ScopeItem>
        </ScopeList>
      </ScopeInputSection>
      <ButtonContainer>
        <PrevButton onClick={onPrev}>
          <PrevButtonIcon src={NextButtonIconImage} />
          <PrevButtonText>이전</PrevButtonText>
        </PrevButton>
        <RegisterButton onClick={onRegister}>
          <RegisterButtonText>등록</RegisterButtonText>
        </RegisterButton>
      </ButtonContainer>
    </OtherInputPageWrapper>
  );
}

const ScopeList = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: fit-content;
  margin-top: 1.5rem;
`;

const ScopeItem = styled.div`
  display: flex;
  padding: 0.38rem 1.25rem;
  border-radius: 7.5rem;
  border: 1px solid var(--Light-blue, #49d8ff);
  background: ${({ $isSelected }) => ($isSelected ? "#00C8FF" : "#fff")};
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const ScopeIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  flex-shrink: 0;
  filter: ${({ $isSelected }) =>
    $isSelected ? "brightness(0) invert(1)" : "none"};
  transition: filter 0.2s ease;
`;

const ScopeItemText = styled.span`
  color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#6ed1ff")};
  text-align: center;
  font-family: Pretendard;
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 500;
  transition: color 0.2s ease;
`;

const ScopeInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  margin-top: 3.13rem;
`;

const CategoryInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  margin-top: 3.13rem;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;
`;

const AiSelectSection = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  border: 2px solid var(--Light-blue, #49d8ff);
  margin-top: 1.5rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;

  &:has(input:checked) label {
    color: var(--B-Blue-line, #00aeff);
  }
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CustomRadioButton = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid ${({ $isChecked }) => ($isChecked ? "#00aeff" : "#D9D9D9")};
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: "";
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background-color: ${({ $isChecked }) =>
      $isChecked ? "#00aeff" : "#D9D9D9"};
    transition: background-color 0.2s ease;
  }
`;

const RadioLabel = styled.label`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`;

const AiNameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
`;

const OtherInputPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleText = styled.span`
  color: var(--B-Blue-line, #00aeff);
  text-align: center;
  font-family: Pretendard;
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.01625rem;
`;

const Content = styled.div`
  color: var(--B-T, #454545);
  font-family: Pretendard;
  font-size: 23px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.23px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5.37rem;
`;

const PrevButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: #f3f3f3;
  padding: 0.72rem 1rem;
  border: none;
`;

const PrevButtonIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  display: block;
  flex-shrink: 0;
  transform: rotate(180deg);
  margin-right: 0.2rem;
`;

const PrevButtonText = styled.span`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
`;

const RegisterButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: var(--Icon-, #001e40);
  padding: 0.72rem 1rem;
  border: none;
`;

const RegisterButtonText = styled.span`
  color: #fff;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
`;
