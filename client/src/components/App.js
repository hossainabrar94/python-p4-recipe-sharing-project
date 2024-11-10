import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CreateRecipePage from "../pages/CreateRecipePage";
import Header from "./Header";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

function App() {

  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
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
          { user ? <CreateRecipePage user = {user} onAddRecipe = {handleAddedRecipe} /> : <HomePage user = {user} recipes = {recipes} /> }
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
