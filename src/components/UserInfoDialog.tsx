import type { User } from "src/types/model"

import { Button } from "@material-ui/core"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@material-ui/core"
import styled from "@emotion/styled/macro"

import UserPiafs from "src/components/UserPiafs"
import { formatRoles } from "src/helpers/role"

const RightCol = styled(Grid)`
  display: flex;
  align-items: center;
`

interface Props {
  open: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
  data?: User
}

const UserInfoDialog = ({ open, handleClose, data }: Props) => {
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
            <RightCol item xs={6}>
              {formatRoles(data.rolesChouette)}
            </RightCol>
            <Grid item xs={6}>
              <h3>Statut</h3>
            </Grid>
            <RightCol item xs={6}>
              {data.statut}
            </RightCol>
            <Grid item xs={6}>
              <h3>Compteur PIAFS</h3>
            </Grid>
            <RightCol item xs={6}>
              {data.nbPiafEffectuees}/{data.nbPiafAttendues}
            </RightCol>
            <Grid item xs={6}>
              <h3>Absence longue durée sans courses</h3>
            </Grid>
            <RightCol item xs={6}>
              {data.absenceLongueDureeSansCourses ? "oui" : "non"}
            </RightCol>
            <Grid item xs={6}>
              <h3>Absence longue durée avec courses</h3>
            </Grid>
            <RightCol item xs={6}>
              {data.absenceLongueDureeCourses ? "oui" : "non"}
            </RightCol>
            <Grid item xs={12}>
              <UserPiafs userId={data.id} validated={false} allowValidate={true} />
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
