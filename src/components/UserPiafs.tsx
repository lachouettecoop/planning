import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { List } from "@material-ui/core"

import { PIAFS } from "src/graphql/queries"
import { ErrorMessage } from "src/helpers/errors"
import Loader from "src/components/Loader"
import Piaf from "src/components/Piaf"

type Result = { piafs: PIAF[] }
interface Props {
  userId: string
  after?: string
  allowValidate?: boolean
}

const UserPiafs = ({ userId, after, allowValidate = false }: Props) => {
  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      userId: `${userId}`,
      after: after,
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

  if (!data.piafs.length && !allowValidate) {
    return <p>Aucune PIAF à venir. Inscrivez-vous sur le planning !</p>
  }

  if (!data.piafs.length && allowValidate) {
    return <p>Aucune PIAF à valider.</p>
  }

  const piafs = data.piafs.slice().sort((left, right) => (left.creneau.debut > right.creneau.debut ? 1 : -1))

  return (
    <List>
      {piafs.map((piaf) => (
        <>
          <Piaf key={piaf.id} piaf={piaf} allowValidate={allowValidate} />
        </>
      ))}
    </List>
  )
}

export default UserPiafs
