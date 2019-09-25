import React from "react";
import { Spinner, Flex } from "@chakra-ui/core";
import Logo from "./Logo";

const SplashScreen = () => (
  <Flex
    bg="primary"
    minHeight="100vh"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <Logo border="2px solid white" size="70vw" objectFit="cover" mb={10} />
    <Spinner size="xl" color="white" />
  </Flex>
);

export default SplashScreen;
