import type { Creneau, PIAF } from "src/types/model"
import { ISlot } from "src/types/app"

import { useState } from "react"
import { ListItem, ListItemAvatar, ListItemText, Checkbox, FormControlLabel, Grid } from "@material-ui/core"
import { useLazyQuery } from "@apollo/client"

import { formatDateLong, formatTime } from "src/helpers/date"
import PiafCircle from "src/components/PiafCircle"
import SlotDialog from "src/components/SlotDialog"
import { SLOTS } from "src/graphql/queries"
import { TypeDialog, useDialog } from "src/providers/dialog"
import { VALIDATE_PIAF } from "src/graphql/queries"
import apollo from "src/helpers/apollo"
import { handleError } from "src/helpers/errors"

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
  const { openDialog } = useDialog()

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

  const handleOnValidatePiaf = async (piafId: string) => {
    //TODO to check the answer of the question and do the validation ONLY if yes
    openDialog("Êtes-vous sûr de vouloir valider cette PIAF ?", "", TypeDialog.YesNo)

    const variables: Record<string, any> = {
      piafId: piafId,
      validate: true,
    }

    try {
      await apollo.mutate({
        mutation: VALIDATE_PIAF,
        variables,
      })

      openDialog("La PIAF a été validé")
    } catch (error) {
      handleError(error)
    }
  }

  const slot: ISlot = {
    id: creneau.id,
    title: creneau.titre,
    start: new Date(creneau.debut),
    end: new Date(creneau.fin),
    piafs: data?.creneau.piafs,
  }

  return (
    <Grid container>
      <Grid item xs={6}>
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
      <Grid item xs={6}>
        {allowValidate && (
          <FormControlLabel
            control={
              <Checkbox
                checked={piaf.pourvu}
                name="validatePIAF"
                onChange={() => {
                  handleOnValidatePiaf(piaf.id)
                }}
              />
            }
            label="Valider PIAF"
          />
        )}
      </Grid>
      <SlotDialog show={open} slot={slot} handleClose={handleClose} />
    </Grid>
  )
}

export default Piaf
