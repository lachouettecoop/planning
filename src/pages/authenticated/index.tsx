import { Redirect, Route, Switch } from "react-router-dom"
import { styled, Container, Button, AppBar, Toolbar, Typography, Box } from "@material-ui/core"

import { useAuthenticatedUser } from "src/providers/user"

import HomePage from "src/pages/authenticated/Home"

const Spacer = styled(Box)({
  flexGrow: 1,
})
const Content = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
}))

const Authenticated = () => {
  const { logout } = useAuthenticatedUser()

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">Planning</Typography>
          <Spacer />
          <Button onClick={logout} color="inherit">
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Content>
        <Switch>
          <Route path="/home">
            <HomePage />
          </Route>
          <Redirect to="/home" />
        </Switch>
      </Content>
    </>
  )
}

export default Authenticated
