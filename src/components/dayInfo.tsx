import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import React from "react"
import { Day } from "./calendarDay"
import clsx from "clsx"
import { Dialog, Modal } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      margin: "0 auto",
    },
  })
)

interface Props {
  day: Day
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const DayInfo = ({ day, show, handleClose }: Props) => {
  const classes = useStyles()

  return (
    <div>
      <Dialog className={clsx(classes.paper)} open={show} onClose={handleClose}>
        <div className="button-close">
          <button onClick={handleClose}>X</button>
        </div>
        <div>
          <h2>{day.title}</h2>
        </div>
      </Dialog>
    </div>
  )
}

export default DayInfo
