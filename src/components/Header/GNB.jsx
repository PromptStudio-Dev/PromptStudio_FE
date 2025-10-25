import styled from "styled-components";
import NavItem from "./NavItem";

const items = [
  { to: "/", label: "Hub", end: true },
  { to: "/archive", label: "Archive" },
  { to: "/maker", label: "Maker" },
];

export default function GNB() {
  return (
    <Nav>
      {items.map((it) => (
        <NavItem key={it.to} to={it.to} end={it.end}>
          {it.label}
        </NavItem>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
