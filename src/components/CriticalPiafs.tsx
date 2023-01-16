import type { PIAF } from "src/types/model"
import type { ISlot } from "src/types/app"

import { useQuery } from "@apollo/client"
import { addDays } from "date-fns"
import { List } from "@material-ui/core"

import Loader from "src/components/Loader"
import Piaf from "src/components/Piaf"
import { useUser } from "src/providers/user"
import { PIAFS } from "src/graphql/queries"
import { queryDate } from "src/helpers/date"
import { ErrorMessage } from "src/helpers/errors"
import { isCritical, CRITICAL_DAYS, orderPiafsByDate, isTaken } from "src/helpers/piaf"
import { hasRole } from "src/helpers/role"

type Result = { piafs: PIAF[] }

const CriticalPiafs = () => {
  const { user } = useUser<true>()
  const now = new Date()

  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      after: queryDate(now),
      before: queryDate(addDays(now, CRITICAL_DAYS + 1)),
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

  const slots: Record<string, ISlot> = {}
  data.piafs.forEach((piaf) => {
    if (!slots[piaf.creneau.id]) {
      slots[piaf.creneau.id] = {
        id: piaf.creneau.id,
        title: piaf.creneau.titre,
        information: piaf.creneau.informations,
        start: new Date(piaf.creneau.debut),
        end: new Date(piaf.creneau.fin),
        horsMag: piaf.creneau.horsMag,
        piafs: [],
      }
    }
    slots[piaf.creneau.id].piafs!.push(piaf)
  })

  const list = data.piafs
    .filter((piaf) => {
      if (isTaken(piaf)) {
        // all good
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
      if (now > new Date(piaf.creneau.debut)) {
        //PIAF already started
        return false
      }
      return isCritical(slots[piaf.creneau.id], piaf)
    })
    .sort(orderPiafsByDate)

  if (!list.length) {
    return <p>Aucun créneau critique dans les jours à venir. Espérons que ça dure !</p>
  }

  return (
    <>
      <p>
        Les créneaux suivants sont vacants et critiques ! N’hésite pas à te positionner, le magasin a besoin de toi !
      </p>
      <List>
        {list.map((piaf) => (
          <Piaf key={piaf.id} piaf={piaf} critical />
        ))}
      </List>
    </>
  )
}

export default CriticalPiafs
