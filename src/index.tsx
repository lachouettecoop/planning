import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline } from "@material-ui/core"
import { ApolloProvider } from "@apollo/client"

import { ErrorBoundary } from "src/helpers/errors"
import apollo from "src/helpers/apollo"
import { UserProvider } from "src/providers/user"
import App from "src/App"

ReactDOM.render(
  <ErrorBoundary>
    <React.StrictMode>
      <CssBaseline />
      <ApolloProvider client={apollo}>
        <UserProvider>
          <App />
        </UserProvider>
      </ApolloProvider>
    </React.StrictMode>
  </ErrorBoundary>,
  document.getElementById("root")
)
