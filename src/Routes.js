import React from "react";
import { Flex, Text, Box, Button } from "@chakra-ui/core";
import { useQuery } from "urql";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useAuth from "./useAuth";
import SplashScreen from "./SplashScreen";

const Planning = React.lazy(() => import("./Planning"));
const DetailJour = React.lazy(() => import("./DetailJour"));

const Routes = () => {
  const { logout } = useAuth();
  const [response] = useQuery({
    query: `{
      me {
        prenom
      }
    }`
  });

  if (response.fetching) {
    return <SplashScreen />;
  } else if (response.error) {
    return "Oops, une erreur est survenue. Contactez les personnes en charge SVP.";
  }

  return (
    <React.Suspense fallback={<SplashScreen />}>
      <Box>
        <Flex
          as="header"
          bg="primary"
          py={2}
          px={4}
          mb={4}
          justifyContent="space-between"
        >
          <Text fontSize="xl" color="white">
            Bienvenue {response.data.me.prenom} !
          </Text>

          <Button onClick={logout} size="sm">
            Se déconnecter
          </Button>
        </Flex>

        <Router>
          <Box px={4}>
            <Switch>
              <Route path="/" exact>
                <Planning />
              </Route>
              <Route path="/planning/:date">
                <DetailJour />
              </Route>
            </Switch>
          </Box>
        </Router>
      </Box>
    </React.Suspense>
  );
};

export default Routes;
