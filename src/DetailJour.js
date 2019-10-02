import React from "react";
import { useParams, Link as ReactRouterLink } from "react-router-dom";
import { Box, Heading, Link, Icon } from "@chakra-ui/core";

const DetailJour = () => {
  const { date } = useParams();

  return (
    <Box>
      <Heading size="2xl">{date}</Heading>
      <Link as={ReactRouterLink} to="/">
        <Icon name="arrow-back" mr={2} />
        Retourner à l'accueil
      </Link>
    </Box>
  );
};

export default DetailJour;
