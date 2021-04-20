import type { Statut, User } from "src/types/model"

import styled from "@emotion/styled/macro"
import { Typography } from "@material-ui/core"

import { useUser } from "src/providers/user"
import UserPiafs from "src/components/UserPiafs"
import ReplacementPiafs from "src/components/ReplacementPiafs"

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    flex: 0 1 50%;
    min-width: 300px;
  }
`
const Status = styled.div`
  p {
    font-size: 2.5rem;
    &::first-letter {
      text-transform: uppercase;
    }
    span {
      font-size: 0.5em;
    }
    margin-bottom: 2rem;
  }
`
const MyPlanning = styled.div``
const Replacements = styled.div``

const getStatus = (user: User | null) => {
  if (!user) {
    return "…"
  }
  const activeStatus = user.statuts.find((s: Statut) => s.actif)
  if (!activeStatus) {
    return "?"
  }
  return activeStatus.libelle
}

const HomePage = () => {
  const { user } = useUser<true>()

  // TODO: replace "14/12" with real calculated value

  return (
    <Container>
      <Status>
        <Typography variant="h2">Mon statut</Typography>
        <Typography>
          14/12 <span>PIAFs attendues</span>
        </Typography>
        <Typography variant="h2">Je suis</Typography>
        <Typography>{getStatus(user)}</Typography>
      </Status>
      <MyPlanning>
        <Typography variant="h2">Mes prochaines PIAFs</Typography>
        <UserPiafs />
      </MyPlanning>
      <Replacements>
        <Typography variant="h2">Remplacements</Typography>
        <ReplacementPiafs />
      </Replacements>
    </Container>
  )
}

export default HomePage
