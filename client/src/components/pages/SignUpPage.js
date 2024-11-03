import styled from "styled-components";
import { Link } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import { Button } from "../styles";

function SignUpPage({ onLogin }) {
  return (
    <Wrapper>
      <Logo>Reciplease</Logo>
      <SignUpForm onLogin={onLogin} />
      <Divider />
      <p>
        Already have an account? &nbsp;
        <Button as={Link} to="/login" color="secondary">
          Log In
        </Button>
      </p>
    </Wrapper>
  );
}

export default SignUpPage;