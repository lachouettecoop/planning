import React from "react"
import { createRoot } from "react-dom/client"
import { ApolloProvider } from "@apollo/client"

import { ErrorBoundary } from "src/helpers/errors"
import apollo from "src/helpers/apollo"
import { UserProvider } from "src/providers/user"
import ThemeProvider from "src/providers/theme"
import { RolesProvider } from "src/providers/roles"
import App from "src/App"

const container = document.getElementById("root")
const root = createRoot(container!)

root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <ThemeProvider>
        <ApolloProvider client={apollo}>
          <UserProvider>
            <RolesProvider>
              <App />
            </RolesProvider>
          </UserProvider>
        </ApolloProvider>
      </ThemeProvider>
    </React.StrictMode>
  </ErrorBoundary>,
)
