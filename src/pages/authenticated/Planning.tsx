import { useQuery } from "@apollo/client"
import clsx from "clsx"
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles"

import CalendarDay from "src/components/calendarDay"
import { Day } from "src/components/calendarDay"
import { PLANNING } from "src/graphql/queries"
import { Creneau } from "src/types/model"
import { List } from "src/helpers/apollo"

type Result = { creneaus: List<Creneau> }

const useStyles = makeStyles((theme) =>
  createStyles({
    dayContainer: {
      display: "flex",
      flexWrap: "wrap",
    },
  })
)

const Planning = () => {
  const classes = useStyles()
  const { data, /*loading, */ error } = useQuery<Result>(PLANNING, {
    variables: { dateIni: new Date(2021, 3, 1), dateFin: new Date(2021, 3, 31) },
  })

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  if (!data) {
    return null
  }

  // return <pre>{JSON.stringify(data, null, 2)}</pre>

  return (
    <div className={clsx(classes.dayContainer)}>
      {data.creneaus.edges.map(({ node }) => {
        const day: Day = {
          date: node.date,
          title: node.titre,
          iniHour: new Date(node.heureDebut),
          finHour: new Date(node.heureFin),
          piafs: node.piafs,
        }
        return <CalendarDay day={day} key={node.id} />
      })}
    </div>
  )
}

export default Planning
