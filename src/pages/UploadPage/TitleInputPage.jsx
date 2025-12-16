import React from "react";
import styled from "styled-components";
import CategoryTag from "../HubPage/CategoryTag";
import businessIcon from "../HubPage/assets/businessIcon.svg";
import employeeIcon from "../HubPage/assets/employeeIcon.svg";
import investIcon from "../HubPage/assets/investIcon.svg";
import designIcon from "../HubPage/assets/designIcon.svg";
import normalIcon from "../HubPage/assets/normalIcon.svg";
import studyIcon from "../HubPage/assets/studyIcon.svg";

const UnlockIcon = ({ color = "#A9A9A9" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.3992 1.19995C15.9671 1.19995 14.5935 1.76888 13.5808 2.78157C12.5681 3.79427 11.9992 5.16778 11.9992 6.59995V10.8H3.59922C2.9627 10.8 2.35225 11.0528 1.90216 11.5029C1.45208 11.953 1.19922 12.5634 1.19922 13.2V20.4C1.19922 21.0365 1.45208 21.6469 1.90216 22.097C2.35225 22.5471 2.9627 22.8 3.59922 22.8H15.5992C16.2357 22.8 16.8462 22.5471 17.2963 22.097C17.7464 21.6469 17.9992 21.0365 17.9992 20.4V13.2C17.9992 12.5634 17.7464 11.953 17.2963 11.5029C16.8462 11.0528 16.2357 10.8 15.5992 10.8H13.7992V6.59995C13.7992 5.64517 14.1785 4.7295 14.8536 4.05437C15.5288 3.37924 16.4444 2.99995 17.3992 2.99995C18.354 2.99995 19.2697 3.37924 19.9448 4.05437C20.6199 4.7295 20.9992 5.64517 20.9992 6.59995V9.89995C20.9992 10.1386 21.094 10.3676 21.2628 10.5363C21.4316 10.7051 21.6605 10.8 21.8992 10.8C22.1379 10.8 22.3668 10.7051 22.5356 10.5363C22.7044 10.3676 22.7992 10.1386 22.7992 9.89995V6.59995C22.7992 5.89081 22.6595 5.18862 22.3882 4.53346C22.1168 3.8783 21.719 3.28301 21.2176 2.78157C20.7162 2.28014 20.1209 1.88238 19.4657 1.611C18.8106 1.33963 18.1084 1.19995 17.3992 1.19995Z"
      fill={color}
    />
  </svg>
);

const LockIcon = ({ color = "#A9A9A9" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.0004 1.30005C11.4489 1.30005 9.9609 1.91639 8.86382 3.01347C7.76673 4.11056 7.15039 5.59853 7.15039 7.15005V11.7H6.50039C5.81083 11.7 5.14951 11.974 4.66191 12.4616C4.17432 12.9492 3.90039 13.6105 3.90039 14.3V22.1C3.90039 22.7896 4.17432 23.4509 4.66191 23.9385C5.14951 24.4261 5.81083 24.7 6.50039 24.7H19.5004C20.19 24.7 20.8513 24.4261 21.3389 23.9385C21.8265 23.4509 22.1004 22.7896 22.1004 22.1V14.3C22.1004 13.6105 21.8265 12.9492 21.3389 12.4616C20.8513 11.974 20.19 11.7 19.5004 11.7H18.8504V7.15005C18.8504 5.59853 18.2341 4.11056 17.137 3.01347C16.0399 1.91639 14.5519 1.30005 13.0004 1.30005ZM16.9004 11.7V7.15005C16.9004 6.1157 16.4895 5.12372 15.7581 4.39233C15.0267 3.66094 14.0347 3.25005 13.0004 3.25005C11.966 3.25005 10.9741 3.66094 10.2427 4.39233C9.51128 5.12372 9.10039 6.1157 9.10039 7.15005V11.7H16.9004Z"
      fill={color}
    />
  </svg>
);

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
              as={UnlockIcon}
              color={selectedScope === "공개" ? "#00AEFF" : "#A9A9A9"}
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
              as={LockIcon}
              color={selectedScope === "비공개" ? "#00AEFF" : "#A9A9A9"}
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

  /* 이 페이지에서만 CategoryTag의 font-size를 1.625rem으로 설정 */
  & > * {
    font-size: 1.3rem;
    font-style: normal;
    font-weight: 600;
    padding: 0.42rem 1rem;
  }
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
  border-radius: 0.5rem;
  border: ${({ $isSelected }) =>
    $isSelected ? "1px solid var(--Light-blue, #49D8FF)" : "1px solid #A9A9A9"};
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
`;

const ScopeItemText = styled.span`
  color: ${({ $isSelected }) => ($isSelected ? "#00AEFF" : "#A9A9A9")};
  text-align: center;
  font-family: inherit;
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 500;
  transition: color 0.2s ease;
`;

const TitleText = styled.span`
  color: var(--B-Blue-line, #00aeff);
  text-align: center;
  font-family: inherit;
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.01625rem;
`;

const TitleSection = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 1rem;
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
  font-family: inherit;
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
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #454545;
  font-family: inherit;

  &::placeholder {
    color: #d9d9d9;
  }
`;
