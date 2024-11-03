import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  if (!user) return <HomePage />;

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <main>
        <Switch>
          <Route path="/create">
            <CreateRecipePage user={user} />
          </Route>
          <Route path="/">
            <RecipeList />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
