import type { ISlot } from "src/types/app"

import { capitalize, Dialog, DialogContent, DialogTitle, IconButton } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"

import Loader from "src/components/Loader"
import PiafRow from "src/components/PiafRow"
import { formatTime, formatDateLong } from "src/helpers/date"
import { useUser } from "src/providers/user"

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
`
const Title = styled.div`
  span {
    color: ${({ theme }) => theme.palette.grey[600]};
    margin-left: 5px;
  }
`

interface Props {
  slot: ISlot
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SlotInfo = ({ slot, show, handleClose }: Props) => {
  const { user } = useUser<true>()

  return (
    <Dialog open={show} onClose={handleClose} fullWidth>
      <CloseButton onClick={handleClose}>
        <Close />
      </CloseButton>
      <DialogTitle>
        {capitalize(formatDateLong(slot.start))}
        <br />
        <Title>
          <strong>
            {formatTime(slot.start)}–{formatTime(slot.end)}
          </strong>
          <span>{slot.title}</span>
          <div>{slot.information}</div>
        </Title>
      </DialogTitle>
      <DialogContent>
        {slot.piafs ? (
          slot.piafs.map((piaf) => <PiafRow key={piaf.id} piaf={piaf} user={user} slot={slot} />)
        ) : (
          <Loader />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SlotInfo
