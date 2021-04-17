import type { Creneau, PIAF } from "src/types/model"
import { ISlot } from "src/types/app"

import { useState } from "react"
import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core"
import { useLazyQuery } from "@apollo/client"

import { formatDateLong, formatTime } from "src/helpers/date"
import PiafCircle from "src/components/PiafCircle"
import SlotDialog from "src/components/SlotDialog"
import { SLOTS } from "src/graphql/queries"

interface Result {
  creneau: Creneau
}

interface Props {
  piaf: PIAF
}

const Piaf = ({ piaf }: Props) => {
  const { creneau } = piaf
  const [open, setOpen] = useState(false)

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

  const slot: ISlot = {
    id: creneau.id,
    title: creneau.titre,
    start: new Date(creneau.debut),
    end: new Date(creneau.fin),
    piafs: data?.creneau.piafs,
  }

  return (
    <>
      <ListItem key={piaf.id} button onClick={handleClick}>
        <ListItemAvatar>
          <PiafCircle piaf={piaf} />
        </ListItemAvatar>
        <ListItemText
          primary={formatDateLong(slot.start)}
          secondary={`de ${formatTime(slot.start)} à ${formatTime(slot.end)}`}
        />
      </ListItem>
      <SlotDialog show={open} slot={slot} handleClose={handleClose} />
    </>
  )
}

export default Piaf
