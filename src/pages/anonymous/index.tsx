import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import { Container } from "@material-ui/core"

import LoginPage from "src/pages/anonymous/Login"

const Anonymous = () => {
  const { pathname } = useLocation()

  return (
    <Container>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Redirect to={`/login?next=${pathname}`} />
      </Switch>
    </Container>
  )
}

export default Anonymous
