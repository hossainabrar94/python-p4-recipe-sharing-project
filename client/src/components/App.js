import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CreateRecipePage from "../pages/CreateRecipePage";
import Header from "./Header";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import MyRecipesPage from "../pages/MyRecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import EditRecipePage from "../pages/EditRecipePage";
import FavoritePage from "../pages/FavoritesPage";

function App() {

  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([])
  const [favoriteRecipes, setFavoriteRecipes] = useState([])

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          setUser(user);
          fetch('/favorites')
          .then((r) => r.json())
          .then(setFavoriteRecipes);
        })
      }
      else {
        console.log('User not logged in')
      }
    });

    // Fetch all recipes
    fetch("/recipes")
    .then((r) => r.json())
    .then(setRecipes)
  }, []);

  function handleAddedRecipe(newRecipe) {
    setRecipes((recipes) => [...recipes, newRecipe])
  }

  function handleUpdatedRecipe(updatedRecipe){
    setRecipes((prevRecipes) => 
      prevRecipes.map((prevRecipe) => prevRecipe.id === updatedRecipe.id ? updatedRecipe: prevRecipe)
    )
  }

  return (
    <>
      <main>
        <Switch>
          <Route path ="/login">
            <LoginPage onLogin = {setUser}/>
          </Route>
          <Route path ="/signup">
            <SignUpPage onSignUp = {setUser}/>
          </Route>
          <Route path="/create">
          <Header user={user} setUser={setUser} />
          { user ? (<CreateRecipePage user = {user} onAddRecipe = {handleAddedRecipe} />) : (<HomePage user = {user} recipes = {recipes} /> )}
          </Route>
          <Route path = "/my-recipes">
            {user ? <MyRecipesPage user = {user} recipes = {recipes}/> : <HomePage user = {user} recipes = {recipes} />}
          </Route>
          <Route path="/recipes/:id/edit">
            <EditRecipePage user = {user} handleUpdatedRecipe = {handleUpdatedRecipe}/>
          </Route>
          <Route path="/recipes/:id">
            {user ? <RecipeDetailPage user={user} setRecipes = {setRecipes} favoriteRecipes={favoriteRecipes} setFavoriteRecipes ={setFavoriteRecipes}/> : <HomePage user = {user} recipes = {recipes} />}
          </Route>
          <Route path="/favorites">
            {user ? <FavoritePage user = {user} favoriteRecipes={favoriteRecipes}/> : <HomePage user = {user} recipes = {recipes} />}
          </Route>
          <Route path="/">
            <Header user={user} setUser={setUser} />
            <HomePage user = {user} recipes = {recipes}/>
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
