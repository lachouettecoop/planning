import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import styled from "@emotion/styled/macro"

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
import HistoryPage from "src/pages/authenticated/History"
import LegalPage from "src/pages/Legal"

const Content = styled.div`
  margin: ${({ theme }) => theme.spacing(3)}px;
  ${({ theme }) => theme.breakpoints.down("xs")} {
    margin-bottom: ${({ theme }) => theme.spacing(12)}px;
  }
  ${({ theme }) => theme.breakpoints.up("sm")} {
    margin-left: ${({ theme }) => theme.spacing(12)}px;
  }
`

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
          <Route path="/history" component={HistoryPage} />
          <Redirect to={next || "/home"} />
        </Switch>
        <MenuBottom />
      </Content>
    </DatePlanningProvider>
  )
}

export default Authenticated
