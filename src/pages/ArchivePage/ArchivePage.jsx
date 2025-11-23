import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ChatBar from "../../components/ChatSection/ChatBar";
import PromptCard from "../HubPage/PromptCard";
import ArchiveCategoryTag from "./ArchiveCategoryTag";
import apiClient from "../../api/client";
import tempoProfileImage from "./assets/imageAttachIcon.svg";
import businessIcon from "../HubPage/assets/businessIcon.svg";
import employeeIcon from "../HubPage/assets/employeeIcon.svg";
import investIcon from "../HubPage/assets/investIcon.svg";
import designIcon from "../HubPage/assets/designIcon.svg";
import normalIcon from "../HubPage/assets/normalIcon.svg";
import studyIcon from "../HubPage/assets/studyIcon.svg";

// SVG Components
const CategoryIcon = ({ color }) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 20.5H14.5C15.0523 20.5 15.5 20.9477 15.5 21.5V31C15.5 31.5523 15.0523 32 14.5 32H5C4.44772 32 4 31.5523 4 31V21.5C4 20.9477 4.44772 20.5 5 20.5ZM21.5 20.5H31C31.5523 20.5 32 20.9477 32 21.5V31C32 31.5523 31.5523 32 31 32H21.5C20.9477 32 20.5 31.5523 20.5 31V21.5C20.5 20.9477 20.9477 20.5 21.5 20.5ZM5 4H14.5C15.0523 4 15.5 4.44772 15.5 5V14.5C15.5 15.0523 15.0523 15.5 14.5 15.5H5C4.44772 15.5 4 15.0523 4 14.5V5C4 4.44772 4.44772 4 5 4ZM21.5 4H31C31.5523 4 32 4.44772 32 5V14.5C32 15.0523 31.5523 15.5 31 15.5H21.5C20.9477 15.5 20.5 15.0523 20.5 14.5V5C20.5 4.44772 20.9477 4 21.5 4Z"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const HeartIcon = ({ color }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1212_7004)">
      <path
        d="M9.62774 3.7783C11.8761 4.21919 13.8283 6.65515 14.2641 7.23288C14.3093 7.29283 14.4 7.29283 14.4452 7.23288C14.881 6.65515 16.8332 4.21919 19.0815 3.7783C23.4235 2.92686 26.5778 7.3558 25.0022 12.584C23.6728 16.9952 17.0071 22.3208 14.9561 23.8776C14.5966 24.1505 14.109 24.1616 13.7392 23.9028C11.5615 22.3791 4.28047 17.019 2.94358 12.584C1.36771 7.35625 5.28576 2.92686 9.62774 3.7783Z"
        fill={color}
        stroke={color}
        strokeWidth="1.63043"
      />
    </g>
    <defs>
      <clipPath id="clip0_1212_7004">
        <rect
          width="25"
          height="25"
          fill="white"
          transform="translate(1.5 1.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { name: "전체", img: "" },
    { name: "비즈니스", img: businessIcon },
    { name: "취업", img: employeeIcon },
    { name: "개발", img: investIcon },
    { name: "디자인", img: designIcon },
    { name: "일상", img: normalIcon },
    { name: "학업", img: studyIcon },
  ];

  // 프롬프트 데이터 가져오기
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const memberId = 1; // 고정값 사용
        let endpoint = "";
        let params = { memberId };

        if (activeTab === "category") {
          endpoint = "/api/prompts/me";
          params.category = selectedCategory;
        } else if (activeTab === "heart") {
          endpoint = "/api/prompts/likes";
          params.category = selectedCategory;
        }

        const { data } = await apiClient.get(endpoint, { params });
        setPrompts(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error("프롬프트를 불러오지 못했습니다.", fetchError);
        let errorMessage = "프롬프트를 불러오지 못했습니다.";
        if (fetchError?.response) {
          errorMessage = `서버 오류: ${fetchError.response.status}`;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [activeTab, selectedCategory]);

  return (
    <MainSection>
      <LeftSection>
        <ProfileSection>
          <ProfileHeader>
            <ProfileImage src={tempoProfileImage} />
            <ProfileDetail>
              <ProfileName>John Doe</ProfileName>
              <ProfileInput placeholder="자기소개를 입력해주세요" />
            </ProfileDetail>
          </ProfileHeader>
          <MenuSection>
            <MenuItem
              $isActive={activeTab === "category"}
              onClick={() => setActiveTab("category")}
            >
              <IconWrapper>
                <CategoryIcon
                  color={activeTab === "category" ? "#00AEFF" : "#454545"}
                />
              </IconWrapper>
            </MenuItem>
            <MenuItem
              $isActive={activeTab === "heart"}
              onClick={() => setActiveTab("heart")}
            >
              <IconWrapper>
                <HeartIcon
                  color={activeTab === "heart" ? "#00AEFF" : "#454545"}
                />
              </IconWrapper>
            </MenuItem>
          </MenuSection>
        </ProfileSection>
        <LeftBottomSection>
          <CategorySection>
            <CategoryList>
              {categories.map((category) => (
                <ArchiveCategoryTag
                  key={category.name}
                  name={category.name}
                  img={category.img}
                  isSelected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                />
              ))}
            </CategoryList>
          </CategorySection>
          <PromptSection>
            <PromptCards>
              {isLoading ? (
                <StatusMessage>프롬프트를 불러오는 중입니다.</StatusMessage>
              ) : error ? (
                <StatusMessage>{error}</StatusMessage>
              ) : prompts.length === 0 ? (
                <StatusMessage>표시할 프롬프트가 없습니다.</StatusMessage>
              ) : (
                prompts.map((prompt) => {
                  const promptData = {
                    promptId: prompt.promptId,
                    category: prompt.category ?? "미분류",
                    aiName: prompt.aiEnvironment ?? "AI",
                    title: prompt.title ?? "제목 미상",
                    subtitle: prompt.introduction ?? "",
                    backgroundImage: prompt.imageUrl || "",
                    initialLiked: prompt.liked || false,
                  };

                  return (
                    <PromptCard
                      key={
                        prompt.promptId ?? `${prompt.title}-${prompt.memberId}`
                      }
                      {...promptData}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "copy";
                        event.dataTransfer.setData(
                          "application/json",
                          JSON.stringify(promptData)
                        );
                        window.dispatchEvent(new Event("chatbar-reset"));
                        window.dispatchEvent(
                          new Event("prompt-card-dragstart")
                        );
                      }}
                      onDragEnd={() => {
                        window.dispatchEvent(new Event("prompt-card-dragend"));
                      }}
                    />
                  );
                })
              )}
            </PromptCards>
          </PromptSection>
        </LeftBottomSection>
      </LeftSection>
      <RightSection>
        <ChatBar />
      </RightSection>
    </MainSection>
  );
}

const MainSection = styled.div`
  display: flex;
  height: 100%;
  font-family: "Pretendard Variable", sans-serif;
  overflow: hidden;
`;

const LeftSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 67vw;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
`;

const RightSection = styled.section`
  width: 33vw;
  height: 100%;
  max-height: 100%;
  border-left: 1px solid #aadff7;
  background: #f1f1f1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ProfileSection = styled.section`
  width: 100%;
  padding-top: 2.06rem;
  background-color: #f5fcff;
  border-bottom: 1px solid #aadff7;
  flex-shrink: 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5rem;
  margin-bottom: 3.87rem;
`;

const ProfileImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 1rem;

  @media (max-width: 1600px) {
    width: 5rem;
    height: 5rem;
  }
`;

const ProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 1.13rem;
`;

const ProfileName = styled.div`
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.1875rem;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 0.62rem;
`;

const ProfileInput = styled.input`
  background: #fff;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);

  padding: 0.62rem;
  color: #a6a6a6;
  font-family: "Pretendard Variable";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  width: 30vw;
  border: none;

  &::placeholder {
    color: #a6a6a6;
  }

  &:focus {
    outline: none;
  }
`;

const MenuSection = styled.section`
  width: 12.61vw;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
`;

const MenuItem = styled.div`
  width: 2.875rem;
  border-bottom: 3px solid
    ${({ $isActive }) => ($isActive ? "#00AEFF" : "#454545")};
  display: flex;
  justify-content: center;
  margin-bottom: -1px;
  cursor: pointer;
  transition: border-color 0.2s;
`;

const IconWrapper = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  margin-bottom: 0.81rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
    transition: stroke 0.2s ease, fill 0.2s ease;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  height: fit-content;
  margin-top: 0;
  margin-bottom: 1.19rem;
  padding: 0 10%;

  @media (max-width: 1600px) {
    padding: 0 10%;
  }

  @media (max-width: 1440px) {
    padding: 0 10%;
  }

  @media (max-width: 1024px) {
    padding: 0 10%;
  }
`;

const PromptSection = styled.section`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 10%;

  @media (max-width: 1600px) {
    padding: 0 10%;
  }

  @media (max-width: 1440px) {
    padding: 0 10%;
  }

  @media (max-width: 1024px) {
    padding: 0 10%;
  }
`;

const PromptCards = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem 2rem;
  width: 100%;
  align-content: flex-start;

  @media (max-width: 1600px) {
    gap: 0.75rem 1rem;
  }
`;

const StatusMessage = styled.p`
  width: 100%;
  text-align: center;
  padding: 1.5rem 0;
  color: #7a7a7a;
  font-size: 1rem;
`;

const LeftBottomSection = styled.section`
  height: fit-content;
  width: 100%;
  background-color: #fff;
  margin-top: 1.74rem;
`;

const CategorySection = styled.section`
  width: 100%;
  height: fit-content;
  background-color: #fff;
`;
