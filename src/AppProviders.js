import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { Provider as GraphQLProvider, createClient } from "urql";
import { AuthProvider, getToken } from "./useAuth";
import LCCTheme from "./LCCTheme";

const client = createClient({
  url: process.env.REACT_APP_LCC_API_URL,
  fetchOptions: () => {
    const token = getToken();
    return token
      ? {
          headers: { authorization: token }
        }
      : {};
  }
});

const AppProviders = ({ children }) => (
  <ThemeProvider theme={LCCTheme}>
    <CSSReset />
    <GraphQLProvider value={client}>
      <AuthProvider>{children}</AuthProvider>
    </GraphQLProvider>
  </ThemeProvider>
);

export default AppProviders;
