import React from "react";
import useAuth, { LOGGED_IN } from "./useAuth";
import Routes from "./Routes";
import Login from "./Login";

const App = () => {
  const { authState } = useAuth();

  return authState === LOGGED_IN ? <Routes /> : <Login />;
};

export default App;
