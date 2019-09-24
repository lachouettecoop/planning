import React from "react";
import {
  ThemeProvider,
  CSSReset,
  Text,
  Box,
  Link,
  Image
} from "@chakra-ui/core";
import LCCTheme from "./LCCTheme";
import logo from "./logo.svg";

const App = () => (
  <ThemeProvider theme={LCCTheme}>
    <CSSReset />
    <Box>
      <Box as="header" bg="primary">
        <Image size="100px" objectFit="cover" src={logo} alt="logo" />
        <Text fontSize="xl" color="white">
          Edit <code>src/App.js</code> aaiuend save to reload.
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
  </ThemeProvider>
);

export default App;
