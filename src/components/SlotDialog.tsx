import type { ISlot } from "src/types/app"

import {
  capitalize,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  AccordionSummary,
  Accordion,
} from "@material-ui/core"

import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

import Loader from "src/components/Loader"
import PiafRow from "src/components/PiafRow"
import { formatTime, formatDateLong } from "src/helpers/date"

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
`
const Title = styled.div`
  h3 {
    font-size: 1.5em;
    margin-bottom: 8px;
  }
  h4 {
    font-size: 1.2em;
  }
  span {
    color: ${({ theme }) => theme.palette.grey[600]};
    margin-left: 5px;
    font-weight: 500;
  }
`

const AccordionStyled = styled(Accordion)`
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.palette.grey[200]};
`

interface Props {
  slot: ISlot
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SlotDialog = ({ slot, show, handleClose }: Props) => {
  console.log("slot", slot)
  return (
    <Dialog open={show} onClose={handleClose} fullWidth>
      <CloseButton onClick={handleClose}>
        <Close />
      </CloseButton>
      <DialogTitle disableTypography>
        <Title>
          <Typography variant="h3">{capitalize(formatDateLong(slot.start))}</Typography>
          <Typography variant="h4">
            <strong>
              {formatTime(slot.start)}–{formatTime(slot.end)}
            </strong>
            <span>{slot.title}</span>
          </Typography>
          {slot.demiPiaf && <Typography variant="h5">⚠️ Demi-PIAF</Typography>}
          {slot.demiPiaf && "Cette PIAF dure 1h30 et est comptabilisée comme la moitié d'une PIAF"}
          <div>{slot.information}</div>
        </Title>
      </DialogTitle>
      <DialogContent>
        <>
          {slot.tasks && slot.tasks.length > 0 && (
            <AccordionStyled>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Title>Liste des taches</Title>
              </AccordionSummary>
              <ul style={{ marginTop: "0" }}>
                {slot.tasks?.map((task) => {
                  return (
                    <li style={{ paddingBottom: "8px" }} key={task.id}>
                      <div style={{ fontSize: "18px" }}>
                        {task.link ? (
                          <a target="_blank" href={task.link} rel="noreferrer">
                            {task.title}
                          </a>
                        ) : (
                          task.title
                        )}
                      </div>
                      <div style={{ fontSize: "14px", color: "rgb(117, 117, 117)" }}>{task.description}</div>
                    </li>
                  )
                })}
              </ul>
            </AccordionStyled>
          )}
          {slot.piafs ? slot.piafs.map((piaf) => <PiafRow key={piaf.id} piaf={piaf} slot={slot} />) : <Loader />}
        </>
      </DialogContent>
    </Dialog>
  )
}

export default SlotDialog
