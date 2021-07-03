import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { List } from "@material-ui/core"

import Loader from "src/components/Loader"
import Piaf from "src/components/Piaf"
import { PIAFS } from "src/graphql/queries"
import { ErrorMessage } from "src/helpers/errors"
import { orderPiafsByDate } from "src/helpers/piaf"

type Result = { piafs: PIAF[] }
interface Props {
  userId: string
  after?: string
  validated?: boolean
  allowValidate?: boolean
}

const UserPiafs = ({ userId, after, validated = false, allowValidate = false }: Props) => {
  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: { userId, after, validated },
    skip: !userId,
  })

  if (loading || !userId) {
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

  const piafs = data.piafs.filter(({ statut }) => statut !== "remplacement").sort(orderPiafsByDate)

  return (
    <List>
      {piafs.map((piaf) => (
        <Piaf key={piaf.id} piaf={piaf} allowValidate={allowValidate} />
      ))}
    </List>
  )
}

export default UserPiafs
