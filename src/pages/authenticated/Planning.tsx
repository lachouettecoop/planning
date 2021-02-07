import { useQuery } from "@apollo/client"
import { createStyles, makeStyles } from "@material-ui/core/styles"

import CalendarDay from "src/components/calendarDay"
import { Day } from "src/components/calendarDay"
import { PLANNING } from "src/graphql/queries"
import { Creneau } from "src/types/model"
import { List } from "src/helpers/apollo"

type Result = { creneaus: List<Creneau> }

const useStyles = makeStyles(() =>
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
  const creneaus = data.creneaus.edges.slice() //copy data to avoid immutable error on sorting
  return (
    <div className={classes.dayContainer}>
      {creneaus
        .sort((a, b) => {
          return new Date(a.node.date).getTime() - new Date(b.node.date).getTime()
        })
        .map(({ node }) => {
          const day: Day = {
            date: new Date(node.date),
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
