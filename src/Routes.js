import React from "react";
import { Text, Box, Link, Image } from "@chakra-ui/core";
import useAuth from "./useAuth";

const Routes = () => {
  const { user } = useAuth();
  return (
    <Box>
      <Box as="header" bg="primary">
        <Text fontSize="xl" color="white">
          Bienvenue !{JSON.stringify(user)}
        </Text>
        <Link
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          isExternal
        >
          Learn React
        </Link>
      </Box>
    </Box>
  );
};

export default Routes;
