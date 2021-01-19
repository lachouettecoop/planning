import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline } from "@material-ui/core"
import { BrowserRouter } from "react-router-dom"

import App from "src/App"
import { UserProvider } from "src/providers/User"

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
