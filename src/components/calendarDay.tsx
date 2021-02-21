import { createStyles, makeStyles } from "@material-ui/core/styles"

import { Creneau } from "src/types/model"
import Slot from "src/components/slot"
import { formatDateShort } from "src/helpers/date"

export interface Day {
  date: Date
  creneaus: Array<Creneau>
}

const useStyles = makeStyles(() =>
  createStyles({
    piafContainer: {
      display: "flex",
      flexWrap: "wrap",
      // flex: "0 0 14.28%",
      flex: "14.28%", //In order to have 7 items per row
      border: "gray 1px solid",
    },
    ul: {
      listStyle: "none",
      paddingLeft: "0px",
      margin: "0 auto",
    },
  })
)

interface Props {
  day: Day
}

const CalendarDay = ({ day }: Props) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.piafContainer}>
        <div>{formatDateShort(day.date)}</div>
        <ul className={classes.ul}>
          {day.creneaus.map((slot) => (
            <Slot slot={slot} key={slot.id}></Slot>
          ))}
        </ul>
      </div>
    </>
  )
}

export default CalendarDay
