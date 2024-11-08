import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";

function RecipeDetailPage({setRecipe}) {
    
    const {id} = useParams()
    const [recipe, setRecipe] = useState(null)

    useEffect(() => {
        fetch(`/recipes/${id}`)
        .then((resp) => resp.json())
        .then((resp) => setRecipe(resp))
    }, [id]);
}

if (!recipe) return <p>Loading...</p>;

return (
    <Container>
        <Title>{recipe.title}</Title>
        <Image>{recipe.image}</Image>
        <Minutes>Cook Time: {recipe.minutes_to_complete} min </Minutes>
        <Details>
            <Instructions>Instructions: <br/> {recipe.instructions}</Instructions>
        </Details>
    </Container>
)

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  margin: 20px 0;
`;

const Instructions = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const Details = styled.p`
  font-size: 1rem;
  color: #555;
  margin-top: 10px;
`;

const Minutes = styled.span`
  font-weight: bold
`;

export default RecipeDetailPage;