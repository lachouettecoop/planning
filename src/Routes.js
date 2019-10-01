import React from "react";
import { Text, Box, Link, Button } from "@chakra-ui/core";
import { useQuery } from "urql";
import useAuth from "./useAuth";
import SplashScreen from "./SplashScreen";

const Routes = () => {
  const { logout } = useAuth();
  const [res] = useQuery({
    query: `{
      me {
        prenom
      }
    }`
  });

  if (res.fetching) {
    return <SplashScreen />;
  } else if (res.error) {
    return "Oops, une erreur est survenue. Contactez les personnes en charge SVP.";
  }

  return (
    <Box>
      <Box as="header" bg="primary">
        <Text fontSize="xl" color="white">
          Bienvenue {res.data.me.prenom} !
        </Text>
        <Link
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          isExternal
        >
          Learn React
        </Link>

        <Text>API {res.data.version}</Text>
      </Box>

      <Button onClick={logout}>Se déconnecter</Button>
    </Box>
  );
};

export default Routes;
