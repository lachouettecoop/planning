import type { Statut, User } from "src/types/model"

import styled from "@emotion/styled/macro"

import { useUser } from "src/providers/user"
import UserPiafs from "src/components/UserPiafs"
import ReplacementPiafs from "src/components/ReplacementPiafs"

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    flex: 0 1 50%;
    min-width: 400px;
  }
`
const Status = styled.div`
  h2 {
    margin-bottom: 0;
  }
  h1 {
    font-weight: normal;
    font-size: 2.5em;
    margin-top: 0;
    &::first-letter {
      text-transform: uppercase;
    }
    span {
      font-size: 1.2rem;
    }
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
        <h2>Mon statut</h2>
        <h1>
          14/12 <span>PIAFs attendues</span>
        </h1>
        <h2>Je suis</h2>
        <h1>{getStatus(user)}</h1>
      </Status>
      <MyPlanning>
        <h2>Mes prochaines PIAFs</h2>
        <UserPiafs />
      </MyPlanning>
      <Replacements>
        <h2>Remplacements</h2>
        <ReplacementPiafs />
      </Replacements>
    </Container>
  )
}

export default HomePage
