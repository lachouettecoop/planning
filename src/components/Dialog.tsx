import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"

interface Props {
  open: boolean
  handleClose: () => void
  title: string
  message: string
  callback?: (ok: boolean) => void
}

const Dialog = ({ open, handleClose, title, message, callback }: Props) => {
  const handleConfirm = (ok: boolean) => () => {
    if (callback) {
      setTimeout(callback, 300, ok)
    }
    handleClose()
  }

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      {callback ? (
        <DialogActions>
          <Button onClick={handleConfirm(true)} color="primary">
            Oui
          </Button>
          <Button onClick={handleConfirm(false)} color="primary">
            Non
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      )}
    </MuiDialog>
  )
}

export default Dialog
