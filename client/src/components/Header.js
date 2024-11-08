import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles";
import LoginPage from "../pages/LoginPage";

function Header({ user, setUser }) {
  
    function handleLogoutClick() {
        fetch("/logout", { method: "DELETE" })
        .then((r) => {
            if (r.ok) {
                setUser(null);
            }
        });
    }

  return (
    <Wrapper>
      <Logo>
        <Link to="/">🌶️ The Recipe Hub</Link>
      </Logo>
      <Nav>
        {user ? (
          <>
            <Button variant="outline" onClick={handleLogoutClick}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login">
              Login
            </Button>
            <Button as={Link} to="/signup">
              Sign Up
            </Button>
          </>
        )}
      </Nav>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 3rem;
  color: darkred;
  margin: 0;
  line-height: 1;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  position: absolute;
  right: 8px;
`;

export default Header;
