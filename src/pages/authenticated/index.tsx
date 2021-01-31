import { Redirect, Route, Switch } from "react-router-dom"
import { styled, Container } from "@material-ui/core"
import HomePage from "src/pages/authenticated/Home"
import Planning from "src/pages/authenticated/Planning"
import Menu from "src/components/menu"
import MenuBottom from "src/components/menuBottom"

const Content = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginLeft: theme.spacing(9),
}))

const Authenticated = () => {
  return (
    <>
      <Menu />
      <Content>
        <Switch>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/planning">
            <Planning />
          </Route>
          <Redirect to="/home" />
        </Switch>
        <MenuBottom />
      </Content>
    </>
  )
}

export default Authenticated
