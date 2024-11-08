import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import styled from "@emotion/styled/macro"

import { DatePlanningProvider } from "src/providers/datePlanning"
import { RoleId } from "src/types/model"
import { getParams } from "src/helpers/request"

import Menu from "src/components/menu"
import MenuBottom from "src/components/menuBottom"

import HomePage from "src/pages/authenticated/Home"
import PlanningChouettosPage from "src/pages/authenticated/PlanningChouettos"
import PlanningBdmPage from "src/pages/authenticated/PlanningBdm"
import ProfilePage from "src/pages/authenticated/Profile"
import ReservePage from "src/pages/authenticated/Reserve"
import MagasinPage from "src/pages/authenticated/Magasin"
import BdMPage from "src/pages/authenticated/BdM"
import HistoryPage from "src/pages/authenticated/History"
import RestrictedRoute from "src/pages/authenticated/RestrictedRoute"
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
          <RestrictedRoute path="/home" component={HomePage} roleIds={[RoleId.Chouettos]} redirectionPath="/planning" />
          <Route path="/planning" component={PlanningChouettosPage} />
          <Route path="/planning-bdm" component={PlanningBdmPage} />
          <RestrictedRoute
            path="/profile"
            component={ProfilePage}
            roleIds={[RoleId.Chouettos]}
            redirectionPath="/planning"
          />
          <RestrictedRoute
            path="/reserve"
            component={ReservePage}
            roleIds={[RoleId.Chouettos]}
            redirectionPath="/planning"
          />
          <RestrictedRoute path="/bdm" component={BdMPage} roleIds={[RoleId.AdminBdM]} redirectionPath="/planning" />
          <RestrictedRoute
            path="/magasin"
            component={MagasinPage}
            roleIds={[RoleId.AdminMag]}
            redirectionPath="/planning"
          />
          <RestrictedRoute
            path="/history"
            component={HistoryPage}
            roleIds={[RoleId.Chouettos]}
            redirectionPath="/planning"
          />
          <Route path="/legal" component={LegalPage} />
          <Redirect to={next || "/home"} />
        </Switch>
        <MenuBottom />
      </Content>
    </DatePlanningProvider>
  )
}

export default Authenticated
