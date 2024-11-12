import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Error, FormField, Input, Label, Textarea } from "../styles";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

function EditRecipePage({user, handleUpdatedRecipe}) {

    const {id} = useParams()
    const [recipe, setRecipe] = useState(null)
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory()

    useEffect(() => {
        fetch(`/recipes/${id}`)
        .then((resp) => {
            if(resp.ok){
                return resp.json()
            }
            else{
                history.push('/')
                return Promise.reject('Recipe not found');
            }
        })
        .then((recip) => {
            if(recip.user_id !== user.id ) {
                history.push('/')
            }
            else{
                setRecipe(recip)
            }
        })
    }, [id, user.id])

    if(!recipe) return <p>Loading...</p>;

    function handleChange(e){
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [e.target.name]: e.target.value
        }));
    }
    
    function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true)
        fetch(`/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe),
        })
        .then((resp => {
            if(resp.ok){
                return resp.json()
                .then((updatedRecipe) => {
                    handleUpdatedRecipe(updatedRecipe)
                    history.push(`/recipes/${id}`)
                })
            }
            else{
                return resp.json()
                .then((err) => setErrors(err.errors))
            }
        }))
        .finally(() => setIsLoading(false))
    }

    return (
        <Wrapper>
          <WrapperChild>
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
              <FormField>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={recipe.title}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Label htmlFor="minutesToComplete">Minutes to complete</Label>
                <Input
                  type="number"
                  id="minutesToComplete"
                  name="minutesToComplete"
                  value={recipe.minutes_to_complete}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  rows="10"
                  value={recipe.instructions}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  type="text"
                  id="image"
                  name="image"
                  value={recipe.image}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Button color="primary" type="submit">
                  {isLoading ? "Loading..." : "Submit Recipe"}
                </Button>
              </FormField>
              <FormField>
                {errors.map((err) => (
                  <Error key={err}>{err}</Error>
                ))}
              </FormField>
            </form>
          </WrapperChild>
          <WrapperChild>
            <h1>{recipe.title}</h1>
            <p>
              <em>Time to Complete: {recipe.minutes_to_complete} minutes</em>
              &nbsp;·&nbsp;
              <cite>By {user.username}</cite>
            </p>
            <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
            <ReactMarkdown>{recipe.image}</ReactMarkdown>
          </WrapperChild>
        </Wrapper>
    );
}
    
    const Wrapper = styled.section`
      max-width: 1000px;
      margin: 40px auto;
      padding: 16px;
      display: flex;
      gap: 24px;
    `;
    
    const WrapperChild = styled.div`
      flex: 1;
    `;


export default EditRecipePage;