import { useQuery } from "@apollo/client"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Button } from "@material-ui/core"
import { addDays } from "date-fns"
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons"
import { useState } from "react"

import CalendarDay from "src/components/calendarDay"
import { Day } from "src/components/calendarDay"
import { PLANNING } from "src/graphql/queries"
import { Creneau } from "src/types/model"
import { Edge, List } from "src/helpers/apollo"
import { useDatePlanning } from "src/providers/datePlanning"

type Result = { creneaus: List<Creneau> }

const useStyles = makeStyles(() =>
  createStyles({
    dayContainer: {
      display: "inline-flex",
      flexWrap: "wrap",
    },
    buttonDate: {
      float: "right",
      margin: "5px",
    },
  })
)

const Planning = () => {
  const { goBack, goForward, start, end } = useDatePlanning()
  const [loading, setLoading] = useState(false)

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
  const handleForward = () => {
    setLoading(true)
    goForward()
    setLoading(false)
  }
  const handleBackwards = () => {
    setLoading(true)
    goBack()
    setLoading(false)
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
    <div>
      <div>
        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIos />}
          onClick={handleForward}
          className={classes.buttonDate}
        >
          Suivant
        </Button>
        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIos />}
          onClick={handleBackwards}
          className={classes.buttonDate}
        >
          Précedent
        </Button>
      </div>
      <div className={classes.dayContainer}>
        {days.map((day) => {
          return <CalendarDay day={day} key={day.date.getTime()} />
        })}
      </div>
    </div>
  )
}

export default Planning
