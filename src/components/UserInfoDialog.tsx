import { Button } from "@material-ui/core"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@material-ui/core"
import { userData } from "src/types/model"
import { createStyles, makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() =>
  createStyles({
    row: {
      lineHeight: "4",
    },
  })
)

interface Props {
  open: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
  data: userData | null
}

const UserInfoDialog = ({ open, handleClose, data }: Props) => {
  const classes = useStyles()
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {data?.lastName.toUpperCase()} {data?.name}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid container>
            <Grid item xs={6}>
              <h3>Roles</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data?.roles}
            </Grid>
            <Grid item xs={6}>
              <h3>Status</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data?.status}
            </Grid>
            <Grid item xs={6}>
              <h3>Compteur PIAFS</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data?.nbPiafEffectuees}/{data?.nbPiafAttendues}
            </Grid>
            <Grid item xs={6}>
              <h3>Absence longue durée sans courses</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data?.absenceWithoutPurchase || "---"}
            </Grid>
            <Grid item xs={6}>
              <h3>Absence longue durée avec courses</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data?.absenceWithPurchase || "---"}
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserInfoDialog
