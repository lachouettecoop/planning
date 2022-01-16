import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { startOfToday, addMonths, addWeeks } from "date-fns"
import { List } from "@material-ui/core"

import Loader from "src/components/Loader"
import Piaf from "src/components/Piaf"
import { useUser } from "src/providers/user"
import { PIAFS } from "src/graphql/queries"
import { queryDate } from "src/helpers/date"
import { ErrorMessage } from "src/helpers/errors"
import { orderPiafsByDate } from "src/helpers/piaf"
import { hasRole } from "src/helpers/role"
import { getId } from "src/helpers/apollo"

type Result = { piafs: PIAF[] }
const currentDate = new Date(Date.now())

const ReplacementPiafs = () => {
  const { auth, user } = useUser<true>()

  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      after: queryDate(currentDate),
      before: queryDate(addMonths(currentDate, 2)),
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

  const userRoles = user?.rolesChouette || []

  const otherPiafs = data.piafs
    .filter(
      (piaf) =>
        getId(piaf.piaffeur?.id) !== auth.id &&
        piaf.role &&
        hasRole(piaf.role.roleUniqueId, userRoles) &&
        new Date(piaf.creneau.fin) < addWeeks(startOfToday(), 2) &&
        new Date(piaf.creneau.fin) > currentDate
    )
    .sort(orderPiafsByDate)

  if (!otherPiafs.length) {
    return <p>Aucun remplacement à venir n’est demandé.</p>
  }

  return (
    <>
      <p>
        Les créneaux suivants sont vacants et donc disponibles pour un remplacement. N’hésite pas à te positionner, la
        personne que tu remplaces sera avertie par e-mail instantanément !
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
