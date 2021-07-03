import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { startOfToday, addMonths } from "date-fns"
import { List } from "@material-ui/core"

import Loader from "src/components/Loader"
import Piaf from "src/components/Piaf"
import { useUser } from "src/providers/user"
import { PIAFS } from "src/graphql/queries"
import { queryDate } from "src/helpers/date"
import { ErrorMessage } from "src/helpers/errors"
import { orderPiafsByDate } from "src/helpers/piaf"
import { getId } from "src/helpers/apollo"

type Result = { piafs: PIAF[] }

const ReplacementPiafs = () => {
  const { auth } = useUser<true>()

  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      after: queryDate(startOfToday()),
      before: queryDate(addMonths(startOfToday(), 2)),
      statut: "remplacement",
    },
  })

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data) {
    return null
  }

  const otherPiafs = data.piafs.filter((piaf) => getId(piaf.piaffeur?.id) !== auth.id).sort(orderPiafsByDate)

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
