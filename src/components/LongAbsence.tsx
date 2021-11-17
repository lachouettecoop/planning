import { FormEvent, ChangeEvent, useState } from "react"
import {
  Button,
  Dialog,
  TextField,
  DialogContent,
  DialogActions,
  IconButton,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core"
import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"

import { useDialog } from "src/providers/dialog"
import { formatDateLong } from "src/helpers/date"
import { sendEmail } from "src/helpers/request"
import { handleError } from "src/helpers/errors"
import { formatName } from "src/helpers/user"

import { User } from "src/types/model"

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  > * {
    margin-bottom: 1rem;
    @media (min-width: 400px) {
      flex: 1;
      &:not(:first-of-type) {
        margin-left: ${({ theme }) => theme.spacing(3)}px;
      }
    }
  }
`

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
`

const TextInput = styled(TextField)`
  width: 100%;
`

const Title = styled(DialogTitle)`
  margin-right: 32px;
`

const REASONS = {
  noPiaf: "Je ne pourrai pas assurer ma PIAF",
  noBuy: "Je ne pourrai pas assurer ma PIAF ni effectuer mes courses",
  other: "Autre (spécifier en commentaire)",
}

interface Props {
  show: boolean
  user: User
  handleClose: () => void
}

interface State {
  reason: keyof typeof REASONS | ""
  comment: string
  startDate: string
  endDate: string
}

const LongAbsence = ({ show, handleClose, user }: Props) => {
  const { openDialog } = useDialog()
  const [values, setValues] = useState<State>({
    reason: "",
    comment: "",
    startDate: "",
    endDate: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleReasonChange = ({ target }: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = target
    setValues({
      ...values,
      [name as string]: value,
    })
  }

  const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!process.env.REACT_APP_MAIL_BDM) {
      alert("L’adresse e-mail du BdM n’est pas configurée. Contacte l’administrateur.")
      return
    }

    if (!values.startDate || !values.reason) {
      openDialog("Tous les champs sont obligatoires.")
      return
    }

    setLoading(true)

    try {
      const content = [
        `Nom et prénom : ${formatName(user)}`,
        `Mail : ${user.email} `,
        `Téléphone : ${user.telephone} `,
        `Raison de l'absence : ${REASONS[values.reason]}`,
        `Date début : ${formatDateLong(values.startDate)}`,
      ]
      if (values.comment) {
        content.push(`Commentaire : ${values.comment}`)
      }

      await sendEmail(process.env.REACT_APP_MAIL_BDM, "Absence prolongée", content.join("<br />"))

      handleClose()
      openDialog(
        "Un e-mail a été envoyé au BdM qui te recontactera si besoin. Pense bien a les recontacter lorsque tu pourras reprendre les PIAF."
      )
    } catch (error) {
      handleError(error as Error)
    }

    setLoading(false)
  }

  return (
    <Dialog open={show} onClose={handleClose}>
      <form onSubmit={handleSendEmail} autoComplete="off">
        <CloseButton onClick={handleClose}>
          <Close />
        </CloseButton>
        <Title>Informer d’un changement de ma situation</Title>
        <DialogContent>
          <Row>
            <TextField
              id="startDate"
              label="Date de début"
              name="startDate"
              type="date"
              fullWidth
              required
              value={values.startDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/*            <TextField
              id="endDate"
              label="Date de fin"
              name="endDate"
              type="date"
              fullWidth
              required
              value={values.endDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}
          </Row>
          <Row>
            <FormControl fullWidth>
              <InputLabel>Type de changement</InputLabel>
              <Select
                value={values.reason}
                label="Type de changement"
                name="reason"
                required
                onChange={handleReasonChange}
              >
                {Object.keys(REASONS).map((key) => (
                  <MenuItem value={key} key={key}>
                    {REASONS[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Row>
          <Row>
            <TextInput
              name="comment"
              multiline
              required={values.reason === "other"}
              label="Commentaire additionnel"
              value={values.comment}
              onChange={handleInputChange}
            ></TextInput>
          </Row>
          <Row>
            <span>
              Pour plus d’informations,{" "}
              <a href="https://espace-membres.lachouettecoop.fr/page/les-documents" target="_blank" rel="noopener">
                consultez le manuel du•de la coopérateur•ice
              </a>
              .
            </span>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary" variant="contained" disabled={loading}>
            Confirmer au BdM
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default LongAbsence
