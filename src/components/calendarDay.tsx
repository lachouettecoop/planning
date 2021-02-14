import { useState } from "react"
import clsx from "clsx"
import { createStyles, makeStyles } from "@material-ui/core/styles"

import { List } from "src/helpers/apollo"
import { Creneau } from "src/types/model"
import DayInfo from "src/components/dayInfo"
import { formatTime, formatDateShort } from "src/helpers/date"
import { idRoleGH, idRoleCaissier, statusPiaf } from "src/helpers/constants"

export interface Day {
  date: Date
  creneaus: List<Creneau>
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
    piafAvailable: {
      border: "green 2px solid",
    },
    piafReplacement: {
      border: "orange 2px solid",
    },
    piafContainer: {
      display: "flex",
      flexWrap: "wrap",
      flex: "14%", //In order to have 7 items per row
      // border: "black 2px solid",
    },
    ul: {
      listStyle: "none",
      paddingLeft: "0px",
    },
    ul2: {
      display: "flex",
      justifyContent: "space-between",
      paddingLeft: "0px",
      margin: "0 auto",
    },
    test: {
      border: "solid 2px red",
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
      <div className={classes.piafContainer}>
        <div>{formatDateShort(day.date)}</div>
        <ul className={classes.ul}>
          {day.creneaus.edges.map(({ node: slot }) => (
            <div key={slot.id} className={classes.test}>
              <DayInfo show={open} creneau={slot} handleClose={handleClose} />
              <li onClick={handleClick}>
                <div>{slot.titre}</div>
                {formatTime(new Date(slot.heureDebut))} {formatTime(new Date(slot.heureFin))}
                <ul className={classes.ul2}>
                  {slot.piafs.edges
                    .slice()
                    .sort((a, b) => {
                      const idRoleA = a.node.role.id.split("/")
                      const idRoleB = b.node.role.id.split("/")
                      return parseInt(idRoleA[idRoleA.length - 1]) - parseInt(idRoleB[idRoleB.length - 1])
                    })
                    .map(({ node: piaf }) => (
                      <li
                        key={piaf.id}
                        className={clsx(classes.piafIcon, {
                          [classes.piafAvailable]: !piaf.piaffeur && piaf.statut != statusPiaf.Remplacement,
                          [classes.piafReplacement]: piaf.statut == statusPiaf.Remplacement,
                        })}
                      >
                        {piaf.role.id == idRoleGH ? "GH" : ""}
                        {piaf.role.id == idRoleCaissier ? "C" : ""}
                      </li>
                    ))}
                </ul>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}

export default CalendarDay
