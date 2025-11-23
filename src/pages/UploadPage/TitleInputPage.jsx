import React from "react";
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

export default function TitleInputPage({
  title,
  setTitle,
  introduction,
  setIntroduction,
  category,
  setCategory,
  visible,
  setVisible,
}) {
  const categories = [
    { name: "비즈니스", img: businessIcon },
    { name: "취업", img: employeeIcon },
    { name: "개발", img: investIcon },
    { name: "디자인", img: designIcon },
    { name: "일상", img: normalIcon },
    { name: "학업", img: studyIcon },
  ];

  const handleScopeChange = (scope) => {
    setVisible(scope === "공개");
  };

  const selectedScope =
    visible === true ? "공개" : visible === false ? "비공개" : "";

  return (
    <TitleInputPageWrapper>
      <CategoryInputSection>
        <TitleText>카테고리{!category && "*"}</TitleText>
        <CategoryList>
          {categories.map((cat) => (
            <CategoryTag
              key={cat.name}
              name={cat.name}
              img={cat.img}
              isSelected={category === cat.name}
              onClick={() => setCategory(cat.name)}
            />
          ))}
        </CategoryList>
      </CategoryInputSection>

      <ScopeInputSection>
        <TitleText>공개 범위{!selectedScope && "*"}</TitleText>
        <ScopeList>
          <ScopeItem
            $isSelected={selectedScope === "공개"}
            onClick={() => handleScopeChange("공개")}
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
            onClick={() => handleScopeChange("비공개")}
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

      <TitleSection>
        <Title>프롬프트 제목{!title && "*"}</Title>
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="프롬프트 제목을 입력해주세요."
        />
      </TitleSection>
      <DescriptionSection>
        <Title>프롬프트 설명{!introduction && "*"}</Title>
        <TitleInput
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="프롬프트의 설명을 입력해주세요."
        />
      </DescriptionSection>
    </TitleInputPageWrapper>
  );
}

const TitleInputPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CategoryInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  margin-bottom: 2rem;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  width: 100%;
`;

const ScopeInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  margin-bottom: 2rem;
`;

const ScopeList = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: fit-content;
  margin-top: 1rem;
`;

const ScopeItem = styled.div`
  display: flex;
  padding: 0.38rem 1.25rem;
  border-radius: 7.5rem;
  border: 0.0625rem solid var(--Light-blue, #49d8ff);
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

const TitleSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const DescriptionSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const Title = styled.span`
  color: var(--B-Blue-line, #00aeff);
  font-family: Pretendard;
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: normal;
  letter-spacing: 0.02rem;
`;

const TitleInput = styled.input`
  border-radius: 1rem;
  border: 0.125rem solid var(--Light-blue, #49d8ff);
  padding: 1rem 2.25rem;
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #454545;

  &::placeholder {
    color: #d9d9d9;
  }
`;
