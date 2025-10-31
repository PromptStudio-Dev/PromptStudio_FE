import styled from "styled-components";
import GNB from "./GNB";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <HeaderBar>
      <HeaderInner>
        <GNB />
        <UserMenu />
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
