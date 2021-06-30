import styled from "@emotion/styled/macro"
import { Grid } from "@material-ui/core"

import { PiafIcon } from "src/components/PiafCircle"
import { RoleId } from "src/types/model"

const Container = styled.div`
  border: 1px solid gray;
  border-radius: 10px;
  max-width: 600px;
  margin: 20px 0 100px auto;
  padding: 10px;
  text-align: center;
  ${PiafIcon} {
    width: 32px;
    height: 32px;
  }
`
const CaptionTitle = styled.h3`
  text-align: left;
  margin-top: 0;
`

const IconsCaption = () => {
  return (
    <Container>
      <CaptionTitle>Légende</CaptionTitle>
      <Grid container>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.Chouettos} />
          <div>PIAF disponible</div>
        </Grid>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.Chouettos} $taken />
          <div>PIAF occupée</div>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.Chouettos} />
          <div>Chouettos</div>
        </Grid>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.Caissier} />
          <div>Caissier·ère</div>
        </Grid>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.GrandHibou} />
          <div>Grand Hibou</div>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.Caissier_Acc} />
          <div>Caissier·ère accompagnateur·rice</div>
        </Grid>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.Caissier_Formation} />
          <div>Caissier·ère en formation</div>
        </Grid>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.GrandHibou_Acc} />
          <div>Grand Hibou accompagnateur·rice</div>
        </Grid>
        <Grid item xs={3}>
          <PiafIcon $role={RoleId.GrandHibou_Formation} />
          <div>Grand Hibou en formation</div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default IconsCaption
