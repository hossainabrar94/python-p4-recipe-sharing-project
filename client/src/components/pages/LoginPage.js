import { useState } from "react";
import styled from "styled-components";
import LoginForm from "../components/LoginForm";
import { Button } from "../styles";
import { Link } from "react-router-dom";

function LoginPage({ onLogin }) {

    return (
        <Wrapper>
          <Logo>Reciplease</Logo>
          <LoginForm onLogin={onLogin} />
          <Divider />
          <p>
            Don't have an account? &nbsp;
            <Button as={Link} to="/signup" color="secondary">
              Sign Up
            </Button>
          </p>
        </Wrapper>
      );
}

const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 3rem;
  color: deeppink;
  margin: 8px 0 16px;
`;

const Wrapper = styled.section`
  max-width: 500px;
  margin: 40px auto;
  padding: 16px;
`;

const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 16px 0;
`;

export default LoginPage;
