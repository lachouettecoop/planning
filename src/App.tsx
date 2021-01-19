import { Redirect, Route, Switch } from "react-router-dom"

import { useUser } from "src/providers/User"
import HomePage from "src/pages/authenticated/Home"
import LoginPage from "src/pages/anonymous/Login"

const App = () => {
  const { user } = useUser()

  return user ? (
    <Switch>
      <Route path="/home">
        <HomePage />
      </Route>
      <Redirect to="/home" />
    </Switch>
  ) : (
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Redirect to="/login" />
    </Switch>
  )
}

export default App
