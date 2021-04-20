import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import { styled, Container } from "@material-ui/core"

import { DatePlanningProvider } from "src/providers/datePlanning"
import HomePage from "src/pages/authenticated/Home"
import PlanningPage from "src/pages/authenticated/Planning"
import Profile from "src/pages/authenticated/Profile"
import Menu from "src/components/menu"
import MenuBottom from "src/components/menuBottom"
import { getParams } from "src/helpers/request"
import ReservePage from "src/pages/authenticated/Reserve"

const Content = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  paddingLeft: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(12),
  },
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
            <PlanningPage />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/reserve">
            <ReservePage />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Redirect to={next || "/home"} />
        </Switch>
        <MenuBottom />
      </Content>
    </DatePlanningProvider>
  )
}

export default Authenticated
