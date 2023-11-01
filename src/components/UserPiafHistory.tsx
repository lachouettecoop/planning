import type { PIAF } from "src/types/model"

import { useQuery } from "@apollo/client"
import { List } from "@mui/material"

import { PIAFS } from "src/graphql/queries"
import { ErrorMessage } from "src/helpers/errors"
import { orderPiafsByDate } from "src/helpers/piaf"
import Loader from "src/components/Loader"
import Piaf from "src/components/Piaf"

type Result = { piafs: PIAF[] }
interface Props {
  userId: string
  after: string
  before: string
}
const UserPiafHistory = ({ userId, after, before }: Props) => {
  const { loading, error, data } = useQuery<Result>(PIAFS, {
    variables: {
      before: before,
      after: after,
      statut: "occupe",
      userId: userId,
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

  if (!data.piafs.length) {
    return <p>Tu n’as pas encore fait des PIAF. Inscris-toi sur le planning !</p>
  }

  const historyPiafs = data.piafs.filter(({ pourvu }) => pourvu == true).sort(orderPiafsByDate)

  return (
    <List>
      {historyPiafs.map((piaf) => (
        <Piaf key={piaf.id} piaf={piaf} />
      ))}
    </List>
  )
}

export default UserPiafHistory
