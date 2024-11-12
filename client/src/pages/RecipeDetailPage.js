import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";

function RecipeDetailPage({user, setRecipes, favoriteRecipes, setFavoriteRecipes}) {
    
    const {id} = useParams()
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    const [note, setNote] = useState('')
    const [showNoteInput, setShowNoteInput] = useState(false)
    const history = useHistory()

    useEffect(() => {
        fetch(`/recipes/${id}`)
        .then((r) => {
            if (r.ok) {
              return r.json();
            } 
            else {
                setError("An error occurred");
                return null;
            }
        })
        .then((data) => setRecipe(data))
        .catch((error) => console.error(error));
    }, [id]);
    
    if (error) {
        return (
            <ErrorContainer>
                <ErrorMessage>{error}</ErrorMessage>
                <BackLink to="/">Go back to the homepage</BackLink>
            </ErrorContainer>
        );
    }

    if (!recipe) return <p>Loading...</p>;

    const ownRecipeCheck = recipe.user_id === user.id;

    function handleDelete(){
        fetch(`/recipes/${recipe.id}` , {
            method: 'DELETE',
        })
        .then((resp) => {
            if(resp.ok){
                setRecipes((prevRecipes) => prevRecipes.filter((r) => r.id !== recipe.id));
                history.push('/')
                alert('Recipe Deleted')
            }
            else {
                resp.json()
                .then((error) => {
                    setError('Recipe was not deleted')
                })
            }
        })
    }

    const faveRecipeCheck = favoriteRecipes.find((faveRecipe) => faveRecipe.recipe_id === recipe.id)

    function handleFavoriteAdd(){
        setShowNoteInput(true)
        if(!faveRecipeCheck){
            fetch('/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recipe_id: recipe.id,
                  note: note,
                })
            })
            .then((r) => {
                if (r.ok){
                    r.json()
                    .then((newFave) => {
                        setFavoriteRecipes((prevList) => [...prevList, recipe])
                        setShowNoteInput(false)
                        setNote('')
                    })
                } else {
                    r.json()
                    .then((err) => console.error(err.errors));
                }
            })
        }
    }

    function handleFavoriteRemove(){
        console.log('Remove from Favorites clicked')
        if(faveRecipeCheck){
            fetch(`/favorites/${faveRecipeCheck.id}`, {
                method: 'DELETE',
              })
            .then((r) => {
                if (r.ok) {
                setFavoriteRecipes((prevFavorites) =>
                    prevFavorites.filter((favorite) => favorite.id !== faveRecipeCheck.id)
                );
                } else {
                r.json()
                .then((err) => console.error(err.errors));
                }
            });
        }
    }

    function handleFavoriteSubmit() {
        if (!faveRecipeCheck) {
          fetch('/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipe_id: recipe.id,
              note: note,
            })
          })
            .then((r) => {
              if (r.ok) {
                r.json()
                  .then((newFave) => {
                    setFavoriteRecipes((prevList) => [...prevList, newFave]);
                    setShowNoteInput(false);
                    setNote("");
                  })
              } else {
                r.json()
                  .then((err) => console.error(err.errors));
              }
            })
        }
      }
    
    return (
        <>
            <Header user = {user}/>
            <Container>
            <Title>{recipe.title}</Title>
            <Image src={recipe.image} alt={recipe.title} />
            {ownRecipeCheck ? (
                <>
                    <EditButton as={Link} to={`/recipes/${recipe.id}/edit`}>
                        Edit
                    </EditButton>
                    <DeleteButton onClick={handleDelete}>
                        Delete
                    </DeleteButton>
                </>
            ):( faveRecipeCheck ? (
                <FavoriteButton onClick={handleFavoriteRemove}>
                    ⭐︎ Remove from Favorites
                </FavoriteButton>
                ) : (
                <>
                <FavoriteButton onClick={handleFavoriteAdd}>
                    ⭐︎ Add to Favorites
                </FavoriteButton>
                {showNoteInput ? (
                <NoteContainer>
                    <NoteLabel>Add a note:</NoteLabel>
                    <NoteInput
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter your note here"
                    />
                    <div>
                    <SubmitNoteButton onClick={handleFavoriteSubmit}>
                        Add to Favorites
                    </SubmitNoteButton>
                    <CancelNoteButton onClick={() => setShowNoteInput(false)}>
                        Cancel
                    </CancelNoteButton>
                    </div>
                </NoteContainer>
                ) : null}
                </>
                )
            )}
            <Minutes>Cook Time: {recipe.minutes_to_complete} min</Minutes>
            <Details>
                <Instructions>
                <strong>Instructions:</strong>
                <br />
                {recipe.instructions}
                </Instructions>
            </Details>
            </Container>
        </>
    );
}    

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
  
const Details = styled.div`
    font-size: 1rem;
    color: #555;
    margin-top: 10px;
`;
  
const Minutes = styled.p`
    font-weight: bold;
`;
  
const ErrorContainer = styled.div`
    text-align: center;
    padding: 50px;
`;
  
const ErrorMessage = styled.h2`
    color: red;
`;
  
const BackLink = styled(Link)`
    color: blue;
    text-decoration: underline;
`;

const EditButton = styled(Link)`
    margin-right: 10px;
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
`;

const DeleteButton = styled.button`
    padding: 8px 16px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const FavoriteButton = styled.button`
    margin-right: 10px;
    padding: 6px 6px;
    background-color: #afa14c;
    color: white;
    text-decoration: none;
    border-radius: 16px;
    cursor: pointer;
`;

const NoteContainer = styled.div`
  margin-top: 10px;
`;

const NoteLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const NoteInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
`;

const SubmitNoteButton = styled.button`
  padding: 8px 16px;
  background-color: #afa14c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelNoteButton = styled.button`
  padding: 8px 16px;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
`;

export default RecipeDetailPage;