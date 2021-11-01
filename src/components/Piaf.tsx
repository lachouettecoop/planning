import type { Creneau, PIAF } from "src/types/model"
import { ISlot } from "src/types/app"

import { useState } from "react"
import { ListItem, ListItemAvatar, ListItemText, Checkbox, FormControlLabel, Grid, FormGroup } from "@material-ui/core"
import styled from "@emotion/styled/macro"
import { useLazyQuery } from "@apollo/client"

import PiafCircle from "src/components/PiafCircle"
import SlotDialog from "src/components/SlotDialog"
import { PIAF_NON_POURVU, SLOTS } from "src/graphql/queries"
import { useDialog } from "src/providers/dialog"
import { VALIDATE_PIAF } from "src/graphql/queries"
import { formatDateLong, formatTime } from "src/helpers/date"
import apollo from "src/helpers/apollo"
import { handleError } from "src/helpers/errors"

const Bordered = styled(Grid)`
  border: 1px solid gray;
  border-radius: 5px;
  margin-bottom: 2px;
`

interface Result {
  creneau: Creneau
}

interface Props {
  piaf: PIAF
  allowValidate?: boolean
}

const Piaf = ({ piaf, allowValidate = false }: Props) => {
  const { creneau } = piaf
  const [open, setOpen] = useState(false)
  const { openQuestion, openDialog } = useDialog()

  const [load, { data }] = useLazyQuery<Result>(SLOTS, {
    variables: { id: creneau.id },
  })

  const handleClick = () => {
    setOpen(true)
    load()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleValidate = async (piafId: string) => {
    const ok = await openQuestion("Es-tu sûr·e de vouloir valider cette PIAF ?")

    if (!ok) {
      return
    }

    const variables: Record<string, any> = {
      piafId,
      validate: true,
    }

    try {
      await apollo.mutate({
        mutation: VALIDATE_PIAF,
        variables,
      })

      openDialog("La PIAF a été validée")
    } catch (error) {
      handleError(error as Error)
    }
  }

  const handleNonPourvue = async (piafId: string) => {
    const ok = await openQuestion("Es-tu sûr·e de vouloir indiquer cette PIAF comme non pourvue?")

    if (!ok) {
      return
    }

    const variables: Record<string, any> = {
      piafId,
      nonPourvu: true,
    }

    try {
      await apollo.mutate({
        mutation: PIAF_NON_POURVU,
        variables,
      })

      openDialog("La PIAF a été indiqué comme non pourvue")
    } catch (error) {
      handleError(error as Error)
    }
  }

  const slot: ISlot = {
    id: creneau.id,
    title: creneau.titre,
    information: creneau.informations,
    start: new Date(creneau.debut),
    end: new Date(creneau.fin),
    piafs: data?.creneau.piafs,
  }

  const Container = allowValidate ? Bordered : Grid

  return (
    <Container container>
      <Grid item xs={8}>
        <ListItem key={piaf.id} button onClick={handleClick}>
          <ListItemAvatar>
            <PiafCircle piaf={piaf} />
          </ListItemAvatar>
          <ListItemText
            primary={formatDateLong(slot.start)}
            secondary={`de ${formatTime(slot.start)} à ${formatTime(slot.end)}`}
          />
        </ListItem>
      </Grid>
      <Grid item xs={4}>
        {allowValidate && (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={piaf.pourvu}
                  name="validatePIAF"
                  onChange={() => {
                    handleValidate(piaf.id)
                  }}
                />
              }
              label="Valider"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={piaf.nonPourvu}
                  name="nonPourvu"
                  onChange={() => {
                    handleNonPourvue(piaf.id)
                  }}
                />
              }
              label="Non pourvue"
            />
          </FormGroup>
        )}
      </Grid>
      <SlotDialog show={open} slot={slot} handleClose={handleClose} />
    </Container>
  )
}

export default Piaf
