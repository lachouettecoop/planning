import { useState } from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"

import { List } from "src/helpers/apollo"
import { PIAF } from "src/types/model"
import DayInfo from "src/components/dayInfo"
import { formatTime } from "src/helpers/date"

export interface Day {
  date: string
  iniHour: Date
  finHour: Date
  title: string
  piafs: List<PIAF>
}

const useStyles = makeStyles(() =>
  createStyles({
    piafIcon: {
      display: "inline-flex",
      background: "grey",
      height: "2em",
      width: "2em",
      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    piafContainer: {
      display: "flex",
      flexWrap: "wrap",
      flex: "14%", //In order to have 7 items per row
      border: "black 2px solid",
    },
  })
)

interface Props {
  day: Day
}

const CalendarDay = ({ day }: Props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div className={classes.piafContainer} onClick={handleClick}>
        <div>{day.date}</div>
        <div>{day.title}</div>
        <div>
          {formatTime(day.iniHour)} – {formatTime(day.finHour)}
        </div>
        <ul>
          {day.piafs.edges.map(({ node }) => (
            <li key={node.id}>
              {node.piaffeur?.nom} {node.piaffeur?.prenom} {node.statut} {node.role.libelle}
            </li>
          ))}
        </ul>
      </div>
      <DayInfo show={open} day={day} handleClose={handleClose} />
    </>
  )
}

export default CalendarDay
