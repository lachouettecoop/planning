import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { AuthProvider } from "./useAuth";
import LCCTheme from "./LCCTheme";

const AppProviders = ({ children }) => (
  <ThemeProvider theme={LCCTheme}>
    <CSSReset />
    <AuthProvider>{children}</AuthProvider>
  </ThemeProvider>
);

export default AppProviders;
