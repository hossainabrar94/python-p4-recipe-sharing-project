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
    });

    // Fetch all recipes
    fetch("/recipes")
    .then((r) => r.json())
    .then(setRecipes)
  }, []);

  return (
    <>
    {/* <Header user={user} setUser={setUser} /> */}
      <main>
        <Switch>
          <Route path ="/login">
            <LoginPage onLogin = {setUser}/>
          </Route>
          <Route path ="/signup">
            <SignUpPage onSignUp = {setUser}/>
          </Route>
          <Route path="/create">
          { user ? <CreateRecipePage user = {user} /> : <HomePage user = {user} recipes = {recipes} /> }
          </Route>
          <Route path="/">
            <HomePage user = {user} recipes = {recipes}/>
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
