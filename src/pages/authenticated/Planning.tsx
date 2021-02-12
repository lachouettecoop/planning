import { useQuery } from "@apollo/client"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { addDays, addWeeks, startOfWeek } from "date-fns"

import CalendarDay from "src/components/calendarDay"
import { Day } from "src/components/calendarDay"
import { PLANNING } from "src/graphql/queries"
import { Creneau } from "src/types/model"
import { Edge, List } from "src/helpers/apollo"

type Result = { creneaus: List<Creneau> }

const useStyles = makeStyles(() =>
  createStyles({
    dayContainer: {
      display: "flex",
      flexWrap: "wrap",
    },
  })
)

const NUM_WEEKS = 4

const Planning = () => {
  const now = new Date()
  const start = startOfWeek(now, { weekStartsOn: 1 })
  const end = addWeeks(start, NUM_WEEKS)

  const classes = useStyles()
  const { data, /*loading, */ error } = useQuery<Result>(PLANNING, {
    variables: { after: start, before: end },
  })

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  if (!data) {
    return null
  }

  const days: Array<Day> = []
  const slots = data.creneaus.edges.slice() //copy data to avoid immutable error on sorting
  slots.sort((a, b) => {
    return new Date(a.node.date).getTime() - new Date(b.node.date).getTime()
  })

  let current = new Date(start)
  while (current < end) {
    const daySlots = slots.filter(({ node }) => new Date(node.date).toDateString() === current.toDateString())
    const test: List<Creneau> = {
      edges: [],
      pageInfo: { startCursor: "", endCursor: "", hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    }
    daySlots.map(({ node }) => {
      const c: Edge<Creneau> = {
        node: node,
        cursor: "",
      }

      test.edges.push(c)
    })

    days.push({
      date: new Date(current),
      creneaus: test,
    })
    current = addDays(current, 1)
  }

  return (
    <div className={classes.dayContainer}>
      {days.map((day) => {
        return <CalendarDay day={day} key={day.date.getTime()} />
      })}
    </div>
  )
}

export default Planning
