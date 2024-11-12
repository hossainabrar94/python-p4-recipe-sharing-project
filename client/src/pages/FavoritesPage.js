import { Link } from "react-router-dom";
import styled from "styled-components";
import RecipeCard from "../components/RecipeCard";
import Header from "../components/Header";


function FavoritePage({ user, setUser, favoriteRecipes }){

    return (
        <>
            <HeaderWrapper>
                <Header user={user} setUser={setUser}/>
            </HeaderWrapper>
            <Wrapper>
                <Logo>
                    <h2>🧑🏼‍🍳 My Favorite Recipes</h2>
                </Logo>
                <RecipeGrid>
                {favoriteRecipes.map((favorite) => (
                    <RecipeCardWrapper key={favorite.id}>
                        <Link to={user ? `/recipes/${favorite.recipe.id}` : "/login"}>
                        <RecipeCard recipe={favorite.recipe} note={favorite.note}/>
                        </Link>
                    </RecipeCardWrapper>
                ))}
                </RecipeGrid>
            </Wrapper>
        </>
    )
}

const HeaderWrapper = styled.div`
  text-align: left;
  padding: 10px;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const RecipeCardWrapper = styled.div`
  cursor: pointer;
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

const Wrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  text-align: center;
`;

export default FavoritePage;