import styled from "@emotion/styled/macro"
import { Typography, Button } from "@material-ui/core"
import { startOfToday } from "date-fns"
import { Link } from "react-router-dom"

import apollo from "src/helpers/apollo"
import { queryDate } from "src/helpers/date"
import { handleError } from "src/helpers/errors"
import {
  USER_UPDATE_STOP_ABSENCE_WITHOUT_SHOPPING,
  USER_UPDATE_STOP_ABSENCE_WITH_SHOPPING,
} from "src/graphql/queriesUser"

import { useUser } from "src/providers/user"
import { useDialog } from "src/providers/dialog"
import UserPiafs from "src/components/UserPiafs"
import ReplacementPiafs from "src/components/ReplacementPiafs"
import CriticalPiafs from "src/components/CriticalPiafs"

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
const AbsenceText = styled(Typography)`
  margin-right: 10px;
  color: red;
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
  const { user, refetchUser } = useUser<true>()
  const { openQuestion } = useDialog()

  const counter = `${user?.nbPiafEffectuees ?? "…"}/${user?.nbPiafAttendues ?? "…"}`
  const status = user?.statut || "…"

  const handleClick = async (shopping: boolean) => {
    const ok = await openQuestion(
      "Tu souhaites revenir faire tes PIAF et tes courses ? Super ! Confirme-le ici et l'effet sera immédiat. Pense à t’inscrire à nouveau sur des créneaux de PIAF."
    )
    if (!ok) {
      return
    }
    try {
      if (shopping) {
        await apollo.mutate({ mutation: USER_UPDATE_STOP_ABSENCE_WITH_SHOPPING, variables: { id: user?.id } })
      } else {
        await apollo.mutate({ mutation: USER_UPDATE_STOP_ABSENCE_WITHOUT_SHOPPING, variables: { id: user?.id } })
      }
      refetchUser()
    } catch (errorUpdate) {
      handleError(errorUpdate as Error)
    }
  }

  return (
    <Container>
      <Content>
        <Status>
          <Typography variant="h2">Mon statut</Typography>
          <Typography variant="h3">
            {counter} <span>PIAF attendues</span>
          </Typography>
          {!user?.absenceLongueDureeCourses && !user?.absenceLongueDureeSansCourses && (
            <>
              <Typography variant="h2">Je suis</Typography>
              <StatusText variant="h3" $status={user?.statut}>
                {status}
              </StatusText>
            </>
          )}
          <AbsenceText variant="h2">
            {user?.absenceLongueDureeCourses && (
              <>
                <div>
                  Ma participation aux PIAF du magasin est actuellement en pause, mais je peux toujours faire mes
                  courses
                </div>
                <Button variant="contained" color="primary" size="large" onClick={() => handleClick(true)}>
                  Je reprends ma participation
                </Button>
              </>
            )}

            {user?.absenceLongueDureeSansCourses && (
              <>
                <div>
                  Ma participation aux PIAF du magasin est actuellement en pause et je ne peux pas faire mes courses
                </div>
                <Button variant="contained" color="primary" size="large" onClick={() => handleClick(false)}>
                  Je reprends ma participation
                </Button>
              </>
            )}
          </AbsenceText>
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
