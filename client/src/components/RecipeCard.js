import React from "react";
import styled from "styled-components";

function RecipeCard({recipe}) {

    const description = recipe.instructions.slice(0,70) + '...';

    return (
        <Card>
            <Image src = {recipe.image} alt = {recipe.title}/>
            <Content>
                <Title> {recipe.title} </Title>
                <Minutes> Cook Time: {recipe.minutes_to_complete} min  </Minutes>
                <Description> {description} </Description>
            </Content>
        </Card>
    )
}

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 16px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 8px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

const Minutes = styled.span`
  font-style: italic
`;

export default RecipeCard;