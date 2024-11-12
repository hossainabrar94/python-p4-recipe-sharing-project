import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import RecipeCard from "../components/RecipeCard";

function HomePage({ user, recipes = [] }) {

  return (
    <>
        <Wrapper>
            <Logo>
                <h2>🧑🏼‍🍳 Welcome to The Recipe Hub</h2>
                {user ? '' :<h6>Login to Create Your Very Own Recipe Book</h6> }
            </Logo>
            <RecipeGrid>
            {recipes.map((recipe) => (
                <RecipeCardWrapper key={recipe.id}>
                    <Link to={user ? `/recipes/${recipe.id}` : "/login"}>
                    <RecipeCard recipe={recipe} />
                    </Link>
                </RecipeCardWrapper>
            ))}
            </RecipeGrid>
        </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  text-align: center;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const Logo = styled.div`
  font-family: "Pacifico", cursive;
  font-size: 3rem;
  color: black;
  margin: 0;
  line-height: 1;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const RecipeCardWrapper = styled.div`
  cursor: pointer;
`;

export default HomePage;