import { useState } from "react"
import styled from "@emotion/styled/macro"

import { Creneau } from "src/types/model"
import SlotInfo from "src/components/slotInfo"
import { formatTime } from "src/helpers/date"
import Piaf from "src/components/Piaf"

const SELECTED_COLOR = "#FFFFAA"

const ClickableSlot = styled.button<{ $open: boolean }>`
  border: none;
  background-color: ${({ $open }) => ($open ? SELECTED_COLOR : "transparent")};
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
    margin-left: 5px;
  }
`
const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

interface Props {
  slot: Creneau
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
      <ClickableSlot $open={open} onClick={handleClick}>
        <Title>
          <strong>
            {formatTime(new Date(slot.heureDebut))}–{formatTime(new Date(slot.heureFin))}
          </strong>
          <span>{slot.titre}</span>
        </Title>
        <List>
          {slot.piafs.edges
            .slice()
            .sort((a, b) => (a.node.role.id > b.node.role.id ? 1 : -1))
            .map(({ node: piaf }) => (
              <Piaf key={piaf.id} piaf={piaf} />
            ))}
        </List>
      </ClickableSlot>
      <SlotInfo show={open} creneau={slot} handleClose={handleClose} />
    </>
  )
}

export default Slot
