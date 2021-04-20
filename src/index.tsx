import React from "react"
import ReactDOM from "react-dom"
import { ApolloProvider } from "@apollo/client"

import { ErrorBoundary } from "src/helpers/errors"
import apollo from "src/helpers/apollo"
import { UserProvider } from "src/providers/user"
import ThemeProvider from "src/providers/theme"
import App from "src/App"

ReactDOM.render(
  <ErrorBoundary>
    <React.StrictMode>
      <ThemeProvider>
        <ApolloProvider client={apollo}>
          <UserProvider>
            <App />
          </UserProvider>
        </ApolloProvider>
      </ThemeProvider>
    </React.StrictMode>
  </ErrorBoundary>,
  document.getElementById("root")
)
