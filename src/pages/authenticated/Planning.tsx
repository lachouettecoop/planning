import { useQuery } from "@apollo/client"
import { createStyles, makeStyles } from "@material-ui/core/styles"

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

const numWeeks = 4
const today = new Date(Date.now())
let after = new Date(today)
let todayIndex = today.getDay()
if (todayIndex === 0) todayIndex = 7

after.setDate(today.getDate() - (todayIndex - 1))
const before = new Date(after)
before.setDate(before.getDate() + 7 * numWeeks)

const Planning = () => {
  const classes = useStyles()
  const { data, /*loading, */ error } = useQuery<Result>(PLANNING, {
    variables: { after: after, before: before },
  })

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  if (!data) {
    return null
  }

  const days: Array<Day> = []
  let daySlotsAll = data.creneaus.edges.slice() //copy data to avoid immutable error on sorting
  daySlotsAll = daySlotsAll.sort((a, b) => {
    return new Date(a.node.date).getTime() - new Date(b.node.date).getTime()
  })
  do {
    const daySlots = daySlotsAll.filter((c) => new Date(c.node.date).toDateString() === new Date(after).toDateString())
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
      date: new Date(after),
      creneaus: test,
    })
    after = new Date(after.setDate(after.getDate() + 1))
  } while (after < before)

  return (
    <div className={classes.dayContainer}>
      {days.map((day) => {
        return <CalendarDay day={day} key={day.date.getTime()} />
      })}
    </div>
  )
}

export default Planning
