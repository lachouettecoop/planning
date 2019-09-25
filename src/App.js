import React from "react";
import { Text, Box, Link, Image } from "@chakra-ui/core";
import useAuth from "./useAuth";
import Routes from "./Routes";
import Login from "./Login";

const App = () => {
  const { user } = useAuth();

  return user.name ? <Routes /> : <Login />;
};

export default App;
