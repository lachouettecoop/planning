import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline } from "@material-ui/core"
import { ApolloProvider } from "@apollo/client"

import App from "src/App"
import { UserProvider } from "src/providers/user"
import apollo from "src/helpers/apollo"

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ApolloProvider client={apollo}>
      <UserProvider>
        <App />
      </UserProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
