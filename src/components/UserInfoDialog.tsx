import { Button } from "@material-ui/core"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@material-ui/core"
import { User } from "src/types/model"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { formatRoles } from "src/helpers/role"

// TODO: use @emotion/styled
const useStyles = makeStyles(() =>
  createStyles({
    row: {
      lineHeight: 4,
    },
  })
)

interface Props {
  open: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
  data?: User
}

const UserInfoDialog = ({ open, handleClose, data }: Props) => {
  const classes = useStyles()

  if (!data) {
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {data.prenom} {data.nom.toUpperCase()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid container>
            <Grid item xs={6}>
              <h3>Roles</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {formatRoles(data.rolesChouette)}
            </Grid>
            <Grid item xs={6}>
              <h3>Statut</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data.statut}
            </Grid>
            <Grid item xs={6}>
              <h3>Compteur PIAFS</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data.nbPiafEffectuees}/{data.nbPiafAttendues}
            </Grid>
            <Grid item xs={6}>
              <h3>Absence longue durée sans courses</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data.absenceLongueDureeSansCourses ? "oui" : "non"}
            </Grid>
            <Grid item xs={6}>
              <h3>Absence longue durée avec courses</h3>
            </Grid>
            <Grid className={classes.row} item xs={6}>
              {data.absenceLongueDureeCourses ? "oui" : "non"}
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserInfoDialog
