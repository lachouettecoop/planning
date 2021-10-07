import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import { styled, Container } from "@material-ui/core"

import { DatePlanningProvider } from "src/providers/datePlanning"
import Menu from "src/components/menu"
import MenuBottom from "src/components/menuBottom"
import { getParams } from "src/helpers/request"

import HomePage from "src/pages/authenticated/Home"
import PlanningPage from "src/pages/authenticated/Planning"
import ProfilePage from "src/pages/authenticated/Profile"
import ReservePage from "src/pages/authenticated/Reserve"
import MagasinPage from "src/pages/authenticated/Magasin"
import BdMPage from "src/pages/authenticated/BdM"
import LegalPage from "src/pages/Legal"

const Content = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  // marginBottom: theme.spacing(14),
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
          <Route path="/home" component={HomePage} />
          <Route path="/planning" component={PlanningPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/reserve" component={ReservePage} />
          <Route path="/bdm" component={BdMPage} />
          <Route path="/magasin" component={MagasinPage} />
          <Route path="/legal" component={LegalPage} />
          <Redirect to={next || "/home"} />
        </Switch>
        <MenuBottom />
      </Content>
    </DatePlanningProvider>
  )
}

export default Authenticated
