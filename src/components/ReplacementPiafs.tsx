import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { startOfToday, addDays } from "date-fns"
import { CircularProgress, List } from "@material-ui/core"

import { useUser } from "src/providers/user"
import { PIAFS } from "src/graphql/queries"
import { queryDate } from "src/helpers/date"
import ErrorMessage from "src/components/ErrorMessage"
import Piaf from "src/components/Piaf"

type Result = { piafs: PIAF[] }

const ReplacementPiafs = () => {
  const { auth } = useUser<true>()

  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      after: queryDate(startOfToday()),
      before: queryDate(addDays(startOfToday(), 700)),
      statut: "remplacement",
    },
  })

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return (
      <ErrorMessage>
        <p>Erreur : {error.message}</p>
      </ErrorMessage>
    )
  }

  if (!data) {
    return null
  }

  const otherPiafs = data.piafs.filter((piaf) => piaf.piaffeur?.id !== `/api/users/${auth.id}`)

  if (!otherPiafs.length) {
    return <p>Aucun remplacement à venir n’est demandé.</p>
  }

  return (
    <>
      <p>
        Les créneaux ci dessous ne peuvent plus être effectués par un Chouettos, ils sont disponibles pour un
        remplacement. N’hésites pas à te positionner, la personne que tu remplaces sera avertie par e-mail
        instantanément !
      </p>
      <List>
        {otherPiafs.map((piaf) => (
          <Piaf key={piaf.id} piaf={piaf} />
        ))}
      </List>
    </>
  )
}

export default ReplacementPiafs
