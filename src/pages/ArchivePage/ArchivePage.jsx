import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ChatBar from "../../components/ChatSection/ChatBar";
import PromptCard from "../HubPage/PromptCard";
import ArchiveCategoryTag from "./ArchiveCategoryTag";
import apiClient from "../../api/client";
import { useNavigate } from "react-router-dom";
import { useCopyModal } from "../../contexts/CopyModalContext";
import { useLoginModal } from "../../contexts/LoginModalContext";
import LoginRequiredModal from "../../components/LoginRequiredModal/LoginRequiredModal";
import WarningIcon from "../../components/LoginRequiredModal/assets/warningIcon.svg";
import archiveNotSelectedHeartIcon from "./assets/archiveNotSelectedHeartIcon.svg";
import colorHeartIcon from "../HubPage/assets/colorHeartIcon.svg";
import heartIcon from "./assets/heartIcon.svg";
import businessIcon from "../HubPage/assets/businessIcon.svg";
import employeeIcon from "../HubPage/assets/employeeIcon.svg";
import investIcon from "../HubPage/assets/investIcon.svg";
import designIcon from "../HubPage/assets/designIcon.svg";
import normalIcon from "../HubPage/assets/normalIcon.svg";
import studyIcon from "../HubPage/assets/studyIcon.svg";
import SearchIconImg from "./assets/searchIcon.svg";
import archivePublicIcon from "./assets/archivePublicIcon.svg";
import archivePrivateIcon from "./assets/archivePrivateIcon.svg";
import myCategorySelectedIcon from "./assets/myCategorySelectedIcon.svg";
import myCategoryIcon from "./assets/myCategoryIcon.svg";

// SVG Components
const DropdownArrowIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    style={{
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
    }}
  >
    <path
      d="M12.998 0C13.85 0 14.295 0.986 13.781 1.623L13.705 1.707L7.705 7.707C7.53281 7.87918 7.30371 7.98261 7.06068 7.99789C6.81766 8.01317 6.5774 7.93925 6.385 7.79L6.291 7.707L0.291 1.707L0.208 1.613L0.154 1.536L0.1 1.44L0.0830002 1.404L0.0560002 1.337L0.0240002 1.229L0.0139999 1.176L0.00400019 1.116L0 1.059V0.941L0.00500011 0.883L0.0139999 0.823L0.0240002 0.771L0.0560002 0.663L0.0830002 0.596L0.153 0.464L0.218 0.374L0.291 0.293L0.385 0.21L0.462 0.156L0.558 0.102L0.594 0.085L0.661 0.0579996L0.769 0.026L0.822 0.0159998L0.882 0.00599956L0.939 0.00199985L12.998 0Z"
      fill="#49D8FF"
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

const CategoryIconImg = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  display: block;
`;

const MenuHeartIcon = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  display: block;
`;

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState("모두");
  const [profile, setProfile] = useState({
    name: "",
    profileImageUrl: "",
    introduction: "",
  });
  const [introductionInput, setIntroductionInput] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { showCopyModal } = useCopyModal();
  const { startGoogleLogin } = useLoginModal();

  const visibilityOptions = [
    { name: "모두", icon: null },
    { name: "공개", icon: archivePublicIcon },
    { name: "비공개", icon: archivePrivateIcon },
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

  // 프롬프트 데이터 가져오기
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let endpoint = "";
        const visibilityParam =
          selectedVisibility === "공개"
            ? "public"
            : selectedVisibility === "비공개"
            ? "private"
            : "all";

        const trimmedQuery = searchQuery.trim();
        const isSearching = Boolean(trimmedQuery);

        if (activeTab === "category") {
          endpoint = isSearching ? "/api/prompts/me/search" : "/api/prompts/me";
        } else if (activeTab === "heart") {
          endpoint = isSearching
            ? "/api/prompts/likes/search"
            : "/api/prompts/likes";
        }

        const params =
          activeTab === "category"
            ? {
                category: selectedCategory,
                visibility: visibilityParam,
                ...(isSearching ? { q: trimmedQuery } : {}),
              }
            : {
                category: selectedCategory,
                ...(isSearching ? { q: trimmedQuery } : {}),
              };

        const { data } = await apiClient.get(endpoint, { params });
        setPrompts(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error("프롬프트를 불러오지 못했습니다.", fetchError);

        // 401 에러인 경우 오류 모달 표시 (X 버튼 없음, 허브로 이동 버튼 있음)
        if (fetchError?.response?.status === 401) {
          setErrorMessage("인증이 만료되었습니다. 다시 로그인해주세요.");
          setIsErrorModalOpen(true);
        } else {
          // 다른 에러인 경우 오류 모달 표시 (X 버튼 있음, 허브로 이동 버튼 없음)
          let errorMessage = "프롬프트를 불러오지 못했습니다.";
          if (fetchError?.response) {
            errorMessage = `서버 오류: ${fetchError.response.status}`;
          }
          setErrorMessage(errorMessage);
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [activeTab, selectedCategory, selectedVisibility, searchQuery]);

  // 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get("/api/members/me");
        setProfile(data);
        setIntroductionInput(data.introduction || "");
      } catch (err) {
        console.error("프로필 정보를 불러오지 못했습니다.", err);
      }
    };

    fetchProfile();
  }, []);

  // 자기소개 저장 함수
  const saveIntroduction = async () => {
    try {
      await apiClient.patch("/api/members/me", {
        introduction: introductionInput,
      });
      setProfile((prev) => ({ ...prev, introduction: introductionInput }));
      showCopyModal("자기 소개 수정이 완료되었습니다");
    } catch (err) {
      console.error("자기소개 수정 실패:", err);
      setErrorMessage("자기소개 수정에 실패했습니다.");
      setIsErrorModalOpen(true);
    }
  };

  // 자기소개 수정 (Enter 키)
  const handleIntroductionKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await saveIntroduction();
    }
  };

  // 자기소개 수정 (포커스 아웃)
  const handleIntroductionBlur = async () => {
    await saveIntroduction();
  };

  const handlePromptDragStart = (event, promptData) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/json", JSON.stringify(promptData));

    window.dispatchEvent(new Event("chatbar-reset"));

    const dragElement = event.currentTarget;
    if (dragElement) {
      const rect = dragElement.getBoundingClientRect();
      const dragImage = dragElement.cloneNode(true);

      const computedStyle = window.getComputedStyle(dragElement);
      dragImage.style.cssText = computedStyle.cssText;
      dragImage.style.position = "absolute";
      dragImage.style.top = "-9999px";
      dragImage.style.left = "-9999px";
      dragImage.style.setProperty("width", `${rect.width}px`, "important");
      dragImage.style.setProperty("height", `${rect.height}px`, "important");
      dragImage.style.boxSizing = "border-box";
      dragImage.style.maxWidth = "none";
      dragImage.style.maxHeight = "none";
      dragImage.style.minWidth = "0";
      dragImage.style.minHeight = "0";
      dragImage.style.margin = "0";
      dragImage.style.transformOrigin = "top left";
      dragImage.style.transform = "none";
      dragImage.style.opacity = "1";

      dragElement.style.opacity = "0";
      document.body.appendChild(dragImage);

      event.dataTransfer.setDragImage(
        dragImage,
        rect.width / 2,
        rect.height / 2
      );

      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }

    window.dispatchEvent(new Event("prompt-card-dragstart"));
  };

  const handlePromptDragEnd = (event) => {
    if (event?.currentTarget) {
      event.currentTarget.style.opacity = "1";
    }
    window.dispatchEvent(new Event("prompt-card-dragend"));
  };

  return (
    <MainSection>
      <LeftSection>
        <ProfileSection>
          <ProfileHeader>
            <ProfileImageContainer>
              {profile.profileImageUrl ? (
                <ProfileImage src={profile.profileImageUrl} />
              ) : (
                <ProfileImagePlaceholder />
              )}
            </ProfileImageContainer>
            <ProfileDetail>
              <ProfileName>{profile.name || "로딩중"}</ProfileName>
              <ProfileInput
                placeholder="자기소개를 입력해주세요"
                value={introductionInput}
                onChange={(e) => setIntroductionInput(e.target.value)}
                onKeyDown={handleIntroductionKeyDown}
                onBlur={handleIntroductionBlur}
              />
            </ProfileDetail>
          </ProfileHeader>
          <MenuSection>
            <MenuItem
              $isActive={activeTab === "category"}
              onClick={() => setActiveTab("category")}
            >
              <IconWrapper>
                <CategoryIconImg
                  src={
                    activeTab === "category"
                      ? myCategorySelectedIcon
                      : myCategoryIcon
                  }
                  alt="category tab"
                />
              </IconWrapper>
            </MenuItem>
            <MenuItem
              $isActive={activeTab === "heart"}
              onClick={() => setActiveTab("heart")}
            >
              <IconWrapper>
                <MenuHeartIcon
                  src={
                    activeTab === "heart"
                      ? colorHeartIcon
                      : archiveNotSelectedHeartIcon
                  }
                  alt="heart tab"
                />
              </IconWrapper>
            </MenuItem>
          </MenuSection>
        </ProfileSection>
        <LeftBottomSection>
          <SearchBar>
            <SearchIcon src={SearchIconImg} />
            <SearchInput
              placeholder="프롬프트를 검색하세요"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchQuery(e.target.value.trim());
                }
              }}
            />
          </SearchBar>
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
            {activeTab !== "heart" && (
              <CategoryDropdownContainer>
                <CategoryDropdownButton
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <DropdownItemIconWrapper>
                    <DropdownArrowIcon isOpen={isDropdownOpen} />
                  </DropdownItemIconWrapper>
                  <DropdownItemText>{selectedVisibility}</DropdownItemText>
                </CategoryDropdownButton>
                {isDropdownOpen && (
                  <CategoryDropdownMenu>
                    {visibilityOptions.map((option) => (
                      <CategoryDropdownItem
                        key={option.name}
                        $isSelected={selectedVisibility === option.name}
                        onClick={() => {
                          setSelectedVisibility(option.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <DropdownItemIconWrapper>
                          {option.icon ? (
                            <DropdownItemIcon
                              src={option.icon}
                              alt={option.name}
                            />
                          ) : (
                            <DropdownArrowIcon isOpen={false} />
                          )}
                        </DropdownItemIconWrapper>
                        <DropdownItemText>{option.name}</DropdownItemText>
                      </CategoryDropdownItem>
                    ))}
                  </CategoryDropdownMenu>
                )}
              </CategoryDropdownContainer>
            )}
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
                      onDragStart={(event) =>
                        handlePromptDragStart(event, promptData)
                      }
                      onDragEnd={handlePromptDragEnd}
                      onHeartToggle={(id, liked) => {
                        setPrompts((prev) =>
                          prev.map((p) =>
                            p.promptId === id ? { ...p, liked } : p
                          )
                        );
                      }}
                      heartIconSrc={heartIcon}
                      heartSelectedIconSrc={colorHeartIcon}
                      onClick={() => {
                        if (prompt.promptId) {
                          navigate(`/prompt/${prompt.promptId}`);
                        }
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
      <LoginRequiredModal
        isOpen={isErrorModalOpen}
        onClose={() => {
          if (errorMessage === "인증이 만료되었습니다. 다시 로그인해주세요.") {
            navigate("/");
          }
          setIsErrorModalOpen(false);
        }}
        icon={WarningIcon}
        text={errorMessage || "오류가 발생했습니다"}
        buttonText={
          errorMessage === "인증이 만료되었습니다. 다시 로그인해주세요."
            ? "로그인 하기"
            : undefined
        }
        onButtonClick={() => {
          if (errorMessage === "인증이 만료되었습니다. 다시 로그인해주세요.") {
            startGoogleLogin();
            setIsErrorModalOpen(false);
          }
        }}
        showCloseButton={true}
      />
    </MainSection>
  );
}

const MainSection = styled.div`
  display: flex;
  height: 100%;
  font-family: "Pretendard", sans-serif;
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

const ProfileImageContainer = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 1rem;
  overflow: hidden;

  @media (max-width: 1600px) {
    width: 5rem;
    height: 5rem;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 1rem;
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
  font-family: "Pretendard";
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
  font-family: "Pretendard";
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
  border-bottom: ${({ $isActive }) =>
    $isActive ? "3px solid #00AEFF" : "none"};
  display: flex;
  justify-content: center;
  margin-bottom: -1px;
  cursor: pointer;
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
  display: flex;
  flex-direction: row;
  margin-bottom: 1.19rem;
  position: relative;

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

const CategoryDropdownContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  position: relative;
`;

const CategoryDropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.12rem 1.25rem 0.12rem 0.56rem;
  border-radius: 0.25rem;
  border: 1px solid var(--Light-blue, #49d8ff);
  background: #fff;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #49d8ff;
  }
`;

const DropdownIconWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DropdownText = styled.span`
  color: #454545;
  width: 2.125rem;
  font-size: 1rem;
  font-weight: 500;
`;

const CategoryDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: #fff;
  border: 1px solid var(--Light-blue, #49d8ff);
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 100%;
  overflow: hidden;
`;

const CategoryDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.12rem 1.25rem 0.12rem 0.56rem;
  cursor: pointer;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  background: #fff;
  transition: background-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #f5fcff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const DropdownArrowWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;
`;

const DropdownItemIconWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DropdownItemIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
`;

const DropdownItemText = styled.span`
  color: #454545;
  font-size: 0.8125rem;
  font-family: "Pretendard", sans-serif;
  width: 2.25rem;
  text-align: left;
  font-weight: 500;
`;

const SearchBar = styled.div`
  display: flex;
  width: 14.375rem;
  height: 2.5625rem;
  padding: 0.25rem 0.81rem;
  align-items: center;
  gap: 0.625rem;
  border-radius: 7.5rem;
  border: 2px solid var(--Line_Blue-light, #aadff7);
  background: #fff;
  margin-left: auto;
  margin-right: 2.87rem;
  margin-bottom: 1.74rem;
`;

const SearchIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: "Pretendard", sans-serif;
  color: #000;
  background: transparent;

  &::placeholder {
    color: #a6a6a6;
  }

  &:focus {
    outline: none;
  }
`;
