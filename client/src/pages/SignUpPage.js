import styled from "styled-components";
import { Link } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import { Button } from "../styles";

function SignUpPage({ onSignUp }) {
  
  return (
    <Wrapper>
      <Logo>The Recipe Hub </Logo>
      <br/>
      <SignUpForm onSignUp={onSignUp} />
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

const Logo = styled.h2`
  font-family: "Pacifico", cursive;
  font-size: 3rem;
  color: darkred;
  margin: 0;
  line-height: 1;

  a {
    color: inherit;
    text-decoration: none;
  }
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

export default SignUpPage;