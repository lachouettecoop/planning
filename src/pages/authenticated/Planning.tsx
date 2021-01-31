import { useQuery } from "@apollo/client"

import CalendarDay from "src/components/calendarDay"
import { Day } from "src/components/calendarDay"
import { PLANNING } from "src/graphql/queries"
import { Creneau } from "src/types/model"
import apollo from "src/helpers/apollo"

type Result = {
  creneaus: { edges: { node: Creneau }[] }
}

const Planning = () => {
  const { data, /*loading, */ error } = useQuery<Result>(PLANNING, {
    variables: { dateIni: new Date(1234567), dateFin: new Date(1234567) },
    client: apollo,
  })

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  if (!data) {
    return null
  }

  return (
    <div>
      {data.creneaus.edges.map(({ node }) => {
        const day: Day = {
          date: new Date(node.date),
          title: node.titre,
        }
        return <CalendarDay day={day} key={node.id} />
      })}
    </div>
  )
}

export default Planning
