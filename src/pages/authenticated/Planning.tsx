import { useQuery } from "@apollo/client"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Button, Grid } from "@material-ui/core"
import { addDays } from "date-fns"
import { ArrowBackIos, ArrowForwardIos, Search } from "@material-ui/icons"
import { useState } from "react"
import clsx from "clsx"

import CalendarDay from "src/components/calendarDay"
import { Day } from "src/components/calendarDay"
import { PLANNING } from "src/graphql/queries"
import { Creneau } from "src/types/model"
import { List } from "src/helpers/apollo"
import { useDatePlanning } from "src/providers/datePlanning"

type Result = { creneaus: List<Creneau> }

const useStyles = makeStyles(() =>
  createStyles({
    dayContainer: {
      display: "inline-flex",
      flexWrap: "wrap",
      margin: "10px auto",
    },
    buttonSearch: {
      float: "left",
      margin: "5px",
    },
    buttonDate: {
      float: "right",
      margin: "5px",
    },
    legend: {
      border: "gray solid 1px",
      borderRadius: "10px",
      width: "350px",
      marginLeft: "auto",
      padding: "10px",
      fontSize: "11px",
      textAlign: "center",
    },
    legendTitle: {
      fontSize: "13px",
      fontWeight: "bold",
      textAlign: "left",
    },
    piafIcon: {
      display: "inline-flex",
      background: "grey",
      height: "2em",
      width: "2em",
      borderRadius: "50%",
    },
    piafAvailable: {
      border: "green 2px solid",
    },
    piafReplacement: {
      border: "orange 2px solid",
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
  const handleSearch = () => {
    alert("Coucou")
  }
  const days: Array<Day> = []
  const slots = data.creneaus.edges.slice() //copy data to avoid immutable error on sorting
  slots.sort((a, b) => {
    return new Date(a.node.date).getTime() - new Date(b.node.date).getTime()
  })

  let current = new Date(start)
  while (current < end) {
    const daySlots = slots.filter(({ node }) => new Date(node.date).toDateString() === current.toDateString())
    const arrayCreneau: Array<Creneau> = []
    daySlots.map(({ node }) => {
      arrayCreneau.push(node)
    })

    days.push({
      date: new Date(current),
      creneaus: arrayCreneau,
    })
    current = addDays(current, 1)
  }

  return (
    <div>
      <div className={classes.legend}>
        <div className={classes.legendTitle}>Légende</div>
        <Grid container>
          <Grid item xs={4}>
            <div className={clsx(classes.piafIcon, classes.piafAvailable)}></div>
            <div>PIAF disponible</div>
          </Grid>
          <Grid item xs={4}>
            <span className={clsx(classes.piafIcon, classes.piafReplacement)}></span>
            <div>Cherche remplaçant</div>
          </Grid>
          <Grid item xs={4}>
            <span className={clsx(classes.piafIcon)}></span>
            <div>PIAF occupée</div>
          </Grid>
        </Grid>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Search />}
          onClick={handleSearch}
          className={classes.buttonSearch}
        >
          Recherche
        </Button>
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
