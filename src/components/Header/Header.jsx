import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import GNB from "./GNB";
import UserMenu from "./UserMenu";
import UploadIcon from "./uploadIcon.svg";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMakerRoute = location.pathname.startsWith("/maker");

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <HeaderBar>
      <HeaderInner>
        <GNB />
        <RightGroup>
          {!isMakerRoute && (
            <UploadButton onClick={handleUploadClick}>
              <UploadText>프롬프트 올리기</UploadText>
              <UploadIconImg src={UploadIcon} alt="Upload" />
            </UploadButton>
          )}
          <UserMenu />
        </RightGroup>
      </HeaderInner>
    </HeaderBar>
  );
}

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  height: 6.94vh;
  background: #fff;
  border-bottom: 1px solid #aadff7;
  z-index: 1000;
`;

const HeaderInner = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.48vh 2.03vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UploadButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 11.97vw;
  height: 3.98148148vh;
  padding: 0.5rem 1.56rem;
  min-height: 26px;
  border-radius: 8px;
  background: linear-gradient(99deg, #49d8ff -86.38%, #269aed 148.91%);
  cursor: pointer;
`;

const UploadIconImg = styled.img`
  width: 1.3vw;
  height: 1.3vw;
  min-width: 16px;
  min-height: 16px;
  margin-left: 0.75rem;
`;

const UploadText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 0.99vw;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
`;
