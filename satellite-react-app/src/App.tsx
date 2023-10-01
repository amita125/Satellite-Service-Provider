import React, { useEffect, useState } from "react";
import FormPage from "./components/FormPage";
import Dashboard from "./components/Dashboard";
import "./App.css";
import ErrorBoundary from "./ErrorBoundry";

import { checkLoginStatus } from "./__mocks__/authentication";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    clearLocalStorage();
  };

  const clearLocalStorage = () => {
    const keysToRemove = ["authToken", "refreshToken", "username", "role"];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      checkLoginStatus().then((accessToken) => {
        if (accessToken) {
          setIsLoggedIn(true);
        }
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="app">
      <ErrorBoundary>
        {isLoggedIn ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <FormPage onLogin={handleLogin} />
        )}
      </ErrorBoundary>{" "}
    </div>
  );
};

export default App;
