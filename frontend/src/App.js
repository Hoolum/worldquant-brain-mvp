import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import StrategySubmit from "./components/StrategySubmit";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(tok) {
  if (tok)
    localStorage.setItem("token", tok);
  else
    localStorage.removeItem("token");
}

function parseJwt(token) {
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
}

function App() {
  const [token, updateToken] = useState(getToken());
  const payload = parseJwt(token);
  const isAdmin = payload.isAdmin;

  useEffect(() => {
    if (token) updateToken(token);
  }, [token]);

  function handleLogout() {
    setToken(null);
    updateToken(null);
  }

  return (
    <div>
      <h1>WorldQuant Brain MVP</h1>
      {token ? (
        <>
          <div>
            Hello, {payload.username}!{' '}
            <button onClick={handleLogout}>Logout</button>
          </div>
          <StrategySubmit token={token} />
          <Leaderboard />
          {isAdmin && <AdminPanel token={token} />}
        </>
      ) : (
        <>
          <Login setToken={(t)=>{setToken(t); updateToken(t);}} />
          <Register />
          <Leaderboard />
        </>
      )}
    </div>
  );
}

export default App;
