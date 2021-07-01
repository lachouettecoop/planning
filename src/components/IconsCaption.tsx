import styled from "@emotion/styled/macro"
import { Grid } from "@material-ui/core"

import { PiafIcon } from "src/components/PiafCircle"
import { RoleId } from "src/types/model"

const Container = styled.div`
  border: 1px solid gray;
  border-radius: 10px;
  max-width: 664px;
  margin: 20px 0 100px auto;
  padding: 20px 10px;
  text-align: center;
`
const Title = styled.h3`
  margin-top: 0;
`
const Caption = styled.figcaption`
  word-wrap: break-word;
  padding: 0 4px;
`

const IconsCaption = () => {
  return (
    <Container>
      <Title>Légende</Title>
      <Grid container>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.Chouettos} />
          <Caption>PIAF disponible</Caption>
        </Grid>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.Chouettos} $taken />
          <Caption>PIAF occupée</Caption>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.Chouettos} />
          <Caption>Chouettos</Caption>
        </Grid>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.Caissier} />
          <Caption>Caissier·ère</Caption>
        </Grid>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.GrandHibou} />
          <Caption>Grand Hibou</Caption>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.Caissier_Formation} />
          <Caption>Caissier·ère en formation</Caption>
        </Grid>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.Caissier_Acc} />
          <Caption>Caissier·ère accompagnateur·rice</Caption>
        </Grid>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.GrandHibou_Formation} />
          <Caption>Grand Hibou en formation</Caption>
        </Grid>
        <Grid item xs={3} component="figure">
          <PiafIcon $role={RoleId.GrandHibou_Acc} />
          <Caption>Grand Hibou accompagnateur·rice</Caption>
        </Grid>
      </Grid>
    </Container>
  )
}

export default IconsCaption
