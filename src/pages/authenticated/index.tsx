import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import styled from "@emotion/styled/macro"

import { DatePlanningProvider } from "src/providers/datePlanning"
import { RoleId } from "src/types/model"
import { getParams } from "src/helpers/request"

import Menu from "src/components/menu"
import MenuBottom from "src/components/menuBottom"

import HomePage from "src/pages/authenticated/Home"
import PlanningPage from "src/pages/authenticated/Planning"
import ProfilePage from "src/pages/authenticated/Profile"
import ReservePage from "src/pages/authenticated/Reserve"
import MagasinPage from "src/pages/authenticated/Magasin"
import BdMPage from "src/pages/authenticated/BdM"
import HistoryPage from "src/pages/authenticated/History"
import RestrictedRoute from "src/pages/authenticated/RestrictedRoute"
import LegalPage from "src/pages/Legal"

const Content = styled.div`
  margin: ${({ theme }) => theme.spacing(3)};
  ${({ theme }) => theme.breakpoints.down("xs")} {
    margin-bottom: ${({ theme }) => theme.spacing(12)};
  }
  ${({ theme }) => theme.breakpoints.up("sm")} {
    margin-left: ${({ theme }) => theme.spacing(12)};
  }
`

const Authenticated = () => {
  const { search } = useLocation()
  const { next } = getParams(search)
  console.log(next)

  return (
    <DatePlanningProvider>
      <Menu />
      <Content>
        <Routes>
          <Route
            path="/home"
            element={
              <RestrictedRoute roleIds={[RoleId.Chouettos]} redirectionPath="/planning">
                {" "}
                <HomePage />{" "}
              </RestrictedRoute>
            }
          />
          <Route path="/planning" element={<PlanningPage />} />
          <Route
            path="/profile"
            element={
              <RestrictedRoute roleIds={[RoleId.Chouettos]} redirectionPath="/planning">
                {" "}
                <ProfilePage />{" "}
              </RestrictedRoute>
            }
          />
          <Route
            path="/reserve"
            element={
              <RestrictedRoute roleIds={[RoleId.Chouettos]} redirectionPath="/planning">
                {" "}
                <ReservePage />{" "}
              </RestrictedRoute>
            }
          />
          <Route
            path="/bdm"
            element={
              <RestrictedRoute roleIds={[RoleId.AdminBdM]} redirectionPath="/planning">
                {" "}
                <BdMPage />{" "}
              </RestrictedRoute>
            }
          />
          <Route
            path="/magasin"
            element={
              <RestrictedRoute roleIds={[RoleId.AdminMag]} redirectionPath="/planning">
                {" "}
                <MagasinPage />{" "}
              </RestrictedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <RestrictedRoute roleIds={[RoleId.Chouettos]} redirectionPath="/planning">
                {" "}
                <HistoryPage />{" "}
              </RestrictedRoute>
            }
          />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="*" element={<Navigate to={next || "/home"} replace />} />
        </Routes>
        <MenuBottom />
      </Content>
    </DatePlanningProvider>
  )
}

export default Authenticated
