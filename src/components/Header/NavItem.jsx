import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavItem({ to, end, disabled, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  const handleClick = () => {
    if (!disabled) {
      navigate(to);
    }
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
  gap: 0.625rem;
  border: none;
  background: transparent;
  font-size: 1.625rem;
  font-weight: 700;
  font-family: "Pretendard Variable", sans-serif;
  padding: 0.625rem;
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
