import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { addWeeks } from "date-fns"
import { List } from "@mui/material"

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

const ReplacementPiafs = () => {
  const { auth, user } = useUser<true>()
  const now = new Date()

  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      after: queryDate(now),
      before: queryDate(addWeeks(now, 2)),
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

  const list = data.piafs
    .filter((piaf) => {
      if (getId(piaf.piaffeur?.id) === auth.id) {
        // own PIAF
        return false
      }
      if (!piaf.role) {
        // unknown slot
        return false
      }
      if (!hasRole(piaf.role.roleUniqueId, userRoles)) {
        // user is not trained for this role
        return false
      }
      return true
    })
    .sort(orderPiafsByDate)

  if (!list.length) {
    return <p>Aucun remplacement à venir n’est demandé.</p>
  }

  return (
    <>
      <p>
        Les créneaux suivants sont vacants et donc disponibles pour un remplacement. N’hésite pas à te positionner, la
        personne que tu remplaces sera avertie par e-mail instantanément !
      </p>
      <List>
        {list.map((piaf) => (
          <Piaf key={piaf.id} piaf={piaf} />
        ))}
      </List>
    </>
  )
}

export default ReplacementPiafs
