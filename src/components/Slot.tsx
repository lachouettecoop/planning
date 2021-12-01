import type { ISlot } from "src/types/app"

import { useState } from "react"
import styled from "@emotion/styled/macro"

import SlotDialog from "src/components/SlotDialog"
import PiafCircle from "src/components/PiafCircle"
import { formatTime } from "src/helpers/date"
import { isCritical, isTaken } from "src/helpers/piaf"

const SELECTED_COLOR = "#FFFFAA"
const HIGHLIGHT_COLOR = "#89C7A8"
const HIGHLIGHTED_SLOTS = ["inventaire", "formation"]

const ClickableSlot = styled.button<{ $open: boolean; $slotTitle: string }>`
  width: 100%;
  border: none;
  background-color: ${({ $open, $slotTitle }) =>
    $open
      ? SELECTED_COLOR
      : HIGHLIGHTED_SLOTS.some((title) => $slotTitle.toLowerCase().toString().startsWith(title))
      ? HIGHLIGHT_COLOR
      : "transparent"};
  padding: 5px;
  text-align: left;
  font-size: inherit;
  line-height: inherit;
  font: inherit;
  cursor: pointer;
  &:focus {
    background-color: ${SELECTED_COLOR};
    outline: none;
  }
`
const Title = styled.div`
  span {
    color: gray;
  }
`
const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -2px;
  svg {
    width: 24px;
    height: 24px;
  }
`

interface Props {
  slot: ISlot
}

const Slot = ({ slot }: Props) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <ClickableSlot $open={open} $slotTitle={slot.title || ""} onClick={handleClick}>
        <Title>
          <strong>
            {formatTime(slot.start)}–{formatTime(slot.end)}
          </strong>
          <br />
          <span>{slot.title}</span>
        </Title>
        <List>
          {slot.piafs?.map((piaf) => (
            <PiafCircle key={piaf.id} piaf={piaf} critical={isCritical(slot, piaf) && !isTaken(piaf)} />
          ))}
        </List>
      </ClickableSlot>
      <SlotDialog show={open} slot={slot} handleClose={handleClose} />
    </>
  )
}

export default Slot
