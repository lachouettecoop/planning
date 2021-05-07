import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { startOfToday } from "date-fns"
import { CircularProgress, List } from "@material-ui/core"

import { useUser } from "src/providers/user"
import { PIAFS } from "src/graphql/queries"
import { queryDate } from "src/helpers/date"
import { ErrorMessage } from "src/helpers/errors"
import Piaf from "src/components/Piaf"

type Result = { piafs: PIAF[] }

const UserPiafs = () => {
  const { auth } = useUser<true>()

  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      userId: `/api/users/${auth.id}`,
      after: queryDate(startOfToday()),
    },
  })

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data) {
    return null
  }

  if (!data.piafs.length) {
    return <p>Aucune PIAF à venir. Inscrivez-vous sur le planning !</p>
  }

  return (
    <List>
      {data.piafs
        .slice()
        .sort((piafA, piafB) =>
          new Date(piafA.creneau.debut).getTime() > new Date(piafB.creneau.debut).getTime() ? 1 : -1
        )
        .map((piaf) => (
          <Piaf key={piaf.id} piaf={piaf} />
        ))}
    </List>
  )
}

export default UserPiafs
