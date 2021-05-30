import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

interface Props {
  open: boolean
  handleClose: () => void
  title: string
  message: string
  onConfirm: () => void
}

const YesNoDialog = ({ open, handleClose, title, message, onConfirm }: Props) => {
  const handleYes = () => {
    onConfirm()
    handleClose()
    return true
  }

  const handleNo = () => {
    handleClose()
    return false
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleYes} color="primary">
          Oui
        </Button>
        <Button onClick={handleNo} color="primary">
          Non
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default YesNoDialog
