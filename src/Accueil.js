import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Box, Heading, Link, Button, Stack, Text } from "@chakra-ui/core";
import PIAFButton from "./PIAFButton";

const Accueil = () => {
  return (
    <Box>
      <Box mb={4}>
        <Heading size="2xl">Bienvenue</Heading>
      </Box>

      <Stack spacing={4} align="stretch">
        <Text fontSize="xl">Que voulez-vous faire ?</Text>
        <Link as={ReactRouterLink} to={`/planning/aujourdhui`}>
          <Button size="lg" w="100%">
            Voir le planning du jour
          </Button>
        </Link>
        <Link as={ReactRouterLink} to="/planning">
          <Button size="lg" w="100%">
            Voir le planning global
          </Button>
        </Link>
        <PIAFButton size="lg" w="100%">
          Se positionner sur une PIAF
        </PIAFButton>
      </Stack>
    </Box>
  );
};

export default Accueil;
