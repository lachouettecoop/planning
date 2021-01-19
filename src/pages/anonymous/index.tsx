import { Redirect, Route, Switch } from "react-router-dom"
import { Container } from "@material-ui/core"

import LoginPage from "src/pages/anonymous/Login"

const Anonymous = () => {
  return (
    <Container>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Redirect to="/login" />
      </Switch>
    </Container>
  )
}

export default Anonymous
