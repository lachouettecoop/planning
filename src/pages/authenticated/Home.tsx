import styled from "@emotion/styled/macro"

import type { PIAF } from "src/types/model"
import { USER_PIAFS_BY_DATE } from "src/graphql/queries"
import { useQuery } from "@apollo/client"
import { formatTime, formatDateLong, queryDate } from "src/helpers/date"
import { useUser } from "src/providers/user"
import { startOfToday, addDays } from "date-fns"

const Accueil = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 2fr 3fr;
  column-gap: 10px;
  row-gap: 20px;
`
const MesPiafs = styled.div`
  background: #b573c9;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1em;
  grid-column: 2 / span 1;
  grid-row: 1 / 1;
`
const Role = styled.div`
  color: yellow;
  padding: 8px;
`
const PiafDate = styled.div`
  color: amber;
`
const PiafHoraire = styled.div`
  color: #f5cb42;
`
const PiafsUrgents = styled.div`
  background: #660512;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1em;
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
`
const Status = styled.div`
  background: #efefef;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1em;
  grid-column: 1 / span 1;
  grid-row: 1 / 1;
`
const PiafsAttendues = styled.div`
  display: flex;
  flex-direction: rows;
  color: green;
  h1 {
    align-self: center;
  }
  h4 {
    align-self: center;
    padding: 8px;
  }
`
const ChouetteStatut = styled.div`
  color: purple;
`

type Result = { piafs: PIAF[] }

const HomePage = () => {
  const today: string = queryDate(new Date(startOfToday())).toString() // must be String
  const todayPlusSeven: string = queryDate(addDays(new Date(startOfToday()), 7)).toString()

  const { auth } = useUser<true>()

  const myPiafsData = useQuery<Result>(USER_PIAFS_BY_DATE, {
    variables: {
      idPiaffeur: `/api/users/${auth.id}`,
      after: today,
    },
  })

  const piafsUrgentsData = useQuery<Result>(USER_PIAFS_BY_DATE, {
    variables: {
      after: today,
      before: todayPlusSeven,
    },
  })

  console.log("P U", piafsUrgentsData.data?.piafs)

  const prochainesPiafs = myPiafsData.data?.piafs.map((piaf) => {
    if (piaf.piaffeur) {
      const role = piaf.role.libelle
      const date = piaf.creneau.debut // il faut calculer la date de l'heure du debutiaf.creneau.date
      const heureDebut = piaf.creneau.debut
      const heureFin = piaf.creneau.fin
      const piaffeur = `Chouettos : ${piaf.piaffeur.nom}`
      return (
        <div key={piaf.id}>
          <Role>{role}</Role>
          <div>
            <PiafDate>Le {formatDateLong(new Date(date))} </PiafDate>
            <PiafHoraire>
              de {formatTime(new Date(heureDebut))} à {formatTime(new Date(heureFin))} {piaffeur}
            </PiafHoraire>
          </div>
        </div>
      )
    }
  })

  const creneauxUrgents = piafsUrgentsData.data?.piafs.map((piaf) => {
    if (piaf.piaffeur === null) {
      const role = piaf.role.libelle
      const date = piaf.creneau.debut // il faut calculer la date de l'heure du debutiaf.creneau.date
      const heureDebut = piaf.creneau.debut
      const heureFin = piaf.creneau.fin
      return (
        <div key={piaf.id}>
          <Role>{role}</Role>
          <div>
            <PiafDate>Le {formatDateLong(new Date(date))} </PiafDate>
            <PiafHoraire>
              de {formatTime(new Date(heureDebut))} à {formatTime(new Date(heureFin))}
            </PiafHoraire>
          </div>
        </div>
      )
    }
  })
  return (
    <Accueil>
      <Status>
        <h4>Mon Statut</h4>
        <PiafsAttendues>
          <h1>14/12</h1>
          <h4>Piafs Attendues</h4>
        </PiafsAttendues>
        <ChouetteStatut>
          <h4>Je suis</h4>
          <h1>Très Chouette</h1>
        </ChouetteStatut>
      </Status>
      <MesPiafs>{prochainesPiafs}</MesPiafs>
      <PiafsUrgents>{creneauxUrgents}</PiafsUrgents>
    </Accueil>
  )
}

export default HomePage
