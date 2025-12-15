import styled from "styled-components";
import NavItem from "./NavItem";

const items = [
  { to: "/", label: "Hub", end: true },
  { to: "/archive", label: "Archive", requireAuth: true },
  { to: "/maker", label: "Maker", requireAuth: true },
];

export default function GNB() {
  return (
    <Nav>
      {items.map((it) => (
        <NavItem
          key={it.to}
          to={it.to}
          end={it.end}
          requireAuth={it.requireAuth}
        >
          {it.label}
        </NavItem>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.83vw;
`;
