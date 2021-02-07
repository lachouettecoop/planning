import { Dialog, DialogContent, DialogTitle } from "@material-ui/core"

import { Day } from "src/components/calendarDay"

interface Props {
  day: Day
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const DayInfo = ({ day, show, handleClose }: Props) => {
  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>{day.title}</DialogTitle>
      <DialogContent>
        <button onClick={handleClose}>X</button>
      </DialogContent>
    </Dialog>
  )
}

export default DayInfo
