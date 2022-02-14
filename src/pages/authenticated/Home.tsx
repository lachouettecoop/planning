import styled from "@emotion/styled/macro"
import { Typography } from "@material-ui/core"
import { startOfToday } from "date-fns"
import { Link } from "react-router-dom"

import { useUser } from "src/providers/user"
import UserPiafs from "src/components/UserPiafs"
import ReplacementPiafs from "src/components/ReplacementPiafs"
import CriticalPiafs from "src/components/CriticalPiafs"
import { queryDate } from "src/helpers/date"

// https://style.lachouettecoop.fr/#/couleurs
// TODO: use constants
// https://github.com/lachouettecoop/chouette-admin-chouettos/blob/master/src/Controller/PlanningController.php#L79-L85
const COLORS: Record<string, string> = {
  "très chouette": "#2ECC40",
  chouette: "#FF851B",
  "chouette en alerte": "#FF4136",
}
const StatusText = styled(Typography)<{ $status?: string }>`
  color: ${({ $status, theme }) => ($status && COLORS[$status.toLowerCase()]) || theme.palette.secondary.main};
  &::first-letter {
    text-transform: uppercase;
  }
`

const Container = styled.div`
  min-height: calc(100vh - 132px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Bottom = styled.div`
  font-size: 0.85em;
  margin-top: ${({ theme }) => theme.spacing(4)}px;
`
const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  > div {
    flex: 0 1 calc(50% - 16px);
    min-width: 300px;
    @media (max-width: 750px) {
      flex: 1;
    }
  }
`
const Status = styled.div`
  h3 {
    font-size: 2.5rem;
    span {
      font-size: 0.5em;
    }
    margin-bottom: 2rem;
  }
`

const HomePage = () => {
  const { user } = useUser<true>()

  const counter = `${user?.nbPiafEffectuees ?? "…"}/${user?.nbPiafAttendues ?? "…"}`
  const status = user?.statut || "…"

  return (
    <Container>
      <Content>
        <Status>
          <Typography variant="h2">Mon statut</Typography>
          <Typography variant="h3">
            {counter} <span>PIAF attendues</span>
          </Typography>
          <Typography variant="h2">Je suis</Typography>
          <StatusText variant="h3" $status={user?.statut}>
            {status}
          </StatusText>
        </Status>
        <div>
          <Typography variant="h2">Mes prochaines PIAF</Typography>
          <UserPiafs userId={user?.id} after={queryDate(startOfToday())} />
        </div>
        <div>
          <Typography variant="h2">Créneaux critiques</Typography>
          <CriticalPiafs />
        </div>
        <div>
          <Typography variant="h2">Remplacements</Typography>
          <ReplacementPiafs />
        </div>
      </Content>
      <Bottom>
        <Link to="/legal">Politique de traitement des données personnelles</Link>
        <p>Ce site n’utilise pas de cookies tiers</p>
        <p>
          Un problème ? Une question ? Contacte le BdM :{" "}
          <a href={`mailto:${process.env.REACT_APP_MAIL_BDM}`}>{process.env.REACT_APP_MAIL_BDM}</a>
        </p>
      </Bottom>
    </Container>
  )
}

export default HomePage
