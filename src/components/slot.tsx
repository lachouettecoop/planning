import { useState } from "react"
import clsx from "clsx"
import { createStyles, makeStyles } from "@material-ui/core/styles"

import { Creneau } from "src/types/model"
import SlotInfo from "src/components/slotInfo"
import { formatTime } from "src/helpers/date"
import { idRoleGH, idRoleCaissier, statusPiaf } from "src/helpers/constants"

const useStyles = makeStyles(() =>
  createStyles({
    slot: {
      cursor: "pointer",
      margin: "5px 0",
    },
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
    piafList: {
      display: "flex",
      justifyContent: "space-between",
      paddingLeft: "0px",
      margin: "0 auto",
    },
    date: {
      fontWeight: "bold",
    },
    title: {
      color: "gray",
      marginLeft: "5px",
    },
  })
)

interface Props {
  slot: Creneau
}

const Slot = ({ slot }: Props) => {
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
      <div key={slot.id} className={classes.slot}>
        <SlotInfo show={open} creneau={slot} handleClose={handleClose} />
        <li onClick={handleClick}>
          <span className={classes.date}>
            {" "}
            {formatTime(new Date(slot.heureDebut))} {formatTime(new Date(slot.heureFin))}
          </span>
          <span className={classes.title}>{slot.titre}</span>
          <ul className={classes.piafList}>
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
    </>
  )
}

export default Slot
