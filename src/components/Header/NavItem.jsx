import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../../utils/authStorage";
import { useLoginModal } from "../../contexts/LoginModalContext";

export default function NavItem({ to, end, disabled, requireAuth, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openLoginModal } = useLoginModal();

  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  const handleClick = () => {
    if (disabled) return;

    if (requireAuth && !isLoggedIn()) {
      openLoginModal();
      return;
    }

    navigate(to);
  };

  return (
    <StyledButton
      className={[isActive ? "active" : "", disabled ? "disabled" : ""].join(
        " "
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.52vw;
  border: none;
  background: transparent;
  font-size: 0.99vw;
  font-weight: 700;
  font-family: "Pretendard", sans-serif;
  padding: 0.93vh 0.52vw;
  color: #454545;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: #00aeff;
  }

  &.active {
    color: #00aeff;
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;
