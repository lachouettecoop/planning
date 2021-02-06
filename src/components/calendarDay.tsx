import clsx from "clsx"
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles"
import React from "react"
import { useState } from "react"

import { List } from "src/helpers/apollo"
import { PIAF } from "src/types/model"
import DayInfo from "src/components/dayInfo"

export interface Day {
  date: string
  iniHour: Date
  finHour: Date
  title: string
  piafs: List<PIAF>
}

interface Props {
  day: Day
}
const useStyles = makeStyles((theme) =>
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
const CalendarDay = ({ day }: Props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const openPIAF = () => {
    setOpen(true)
  }

  const handleClose = () => {
    alert("coucou")
    setOpen(false)
  }

  //return <pre>{JSON.stringify(day, null, 2)}</pre>
  return (
    <div className={clsx(classes.piafContainer)} onClick={openPIAF}>
      <DayInfo show={open} day={day} handleClose={handleClose} />
      <div>{day.date}</div>
      <div>{day.title}</div>
      {
        <div>{`${day.iniHour.getHours()}:${day.iniHour.getMinutes()} -
      ${day.finHour.getHours()}:${day.finHour.getMinutes()}`}</div>
      }
      {/* {day.piafs.edges.map(({ node }) => {
        return (
          <div key={node.id}>
            {node.piaffeur?.nom} {node.piaffeur?.prenom} {node.role} {node.statut} {node.role.id}
          </div>
        )
      })} */}
    </div>
  )
}

export default CalendarDay
