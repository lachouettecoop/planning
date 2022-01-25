import { useEffect, useState } from "react"
import styled from "@emotion/styled/macro"
import { Grid, Dialog, DialogContent, DialogActions, Button } from "@material-ui/core"

import { RoleId } from "src/types/model"
import { PiafIcon } from "src/components/PiafCircle"

const Container = styled.div`
  text-align: center;
`
const Title = styled.h3`
  margin: 0 0 2em;
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
        <Grid item xs={4} component="figure">
          <PiafIcon role={RoleId.Chouettos} />
          <Caption>Chouettos</Caption>
        </Grid>
        <Grid item xs={4} component="figure">
          <PiafIcon role={RoleId.Caissier} />
          <Caption>Caissier·ère</Caption>
        </Grid>
        <Grid item xs={4} component="figure">
          <PiafIcon role={RoleId.GrandHibou} />
          <Caption>Grand Hibou</Caption>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={4} component="figure">
          <PiafIcon role={RoleId.PIAF} />
          <Caption>PIAF disponible</Caption>
        </Grid>
        <Grid item xs={4} component="figure">
          <PiafIcon role={RoleId.PIAF} taken />
          <Caption>PIAF occupée</Caption>
        </Grid>
        <Grid item xs={4} component="figure">
          <PiafIcon role={RoleId.PIAF} critical />
          <Caption>PIAF critique</Caption>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={4} component="figure">
          <PiafIcon role={RoleId.Formateur} />
          <Caption>Formateur·ice</Caption>
        </Grid>
      </Grid>
    </Container>
  )
}

export default IconsCaption

export const CaptionDialog = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("caption_dismissed")
    if (!dismissed) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem("caption_dismissed", "true")
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogContent>
        <IconsCaption />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Compris !
        </Button>
      </DialogActions>
    </Dialog>
  )
}
