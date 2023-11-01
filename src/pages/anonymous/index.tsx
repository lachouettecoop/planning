import { Route, Routes, useLocation, Navigate } from "react-router-dom"
import { Container } from "@mui/material"

import LoginPage from "src/pages/anonymous/Login"

const Anonymous = () => {
  const { pathname } = useLocation()

  return (
    <Container>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="*" element={<Navigate to={`/login?next=${pathname}`} replace />} />
      </Routes>
    </Container>
  )
}

export default Anonymous
