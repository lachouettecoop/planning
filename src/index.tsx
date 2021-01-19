import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline } from "@material-ui/core"

import App from "src/App"
import { UserProvider } from "src/providers/user"

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
