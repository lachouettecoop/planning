import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import { styled, Container } from "@material-ui/core"

import { DatePlanningProvider } from "src/providers/datePlanning"
import HomePage from "src/pages/authenticated/Home"
import Planning from "src/pages/authenticated/Planning"
import Menu from "src/components/menu"
import MenuBottom from "src/components/menuBottom"
import { getParams } from "src/helpers/request"

const Content = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  paddingLeft: theme.spacing(12),
}))

const Authenticated = () => {
  const { search } = useLocation()
  const { next } = getParams(search)

  return (
    <DatePlanningProvider>
      <Menu />
      <Content>
        <Switch>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/planning">
            <Planning />
          </Route>
          <Redirect to={next || "/home"} />
        </Switch>
        <MenuBottom />
      </Content>
    </DatePlanningProvider>
  )
}

export default Authenticated
