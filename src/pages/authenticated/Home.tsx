import styled from "@emotion/styled/macro"
import { Typography } from "@material-ui/core"
import { startOfToday } from "date-fns"
import { Link } from "react-router-dom"

import { useUser } from "src/providers/user"
import UserPiafs from "src/components/UserPiafs"
import ReplacementPiafs from "src/components/ReplacementPiafs"
import { queryDate } from "src/helpers/date"

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
  }
`
const Status = styled.div`
  p {
    color: ${({ theme }) => theme.palette.secondary.main};
  }
`

const HomePage = () => {
  const { user } = useUser<true>()

  return (
    <Container>
      <Content>
        <Status>
          <Typography variant="h2">Mon statut</Typography>
          <p>
            Ton compteur de PIAF effectuées et ton statut ne seront disponibles qu’après la remise à zéro des compteurs,
            soit le 29 novembre. D’ici là, ta participation actuelle est mise à disposition à l’accueil du magasin.
          </p>
        </Status>
        <div>
          <Typography variant="h2">Mes prochaines PIAF</Typography>
          <UserPiafs userId={user?.id} after={queryDate(startOfToday())} />
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
