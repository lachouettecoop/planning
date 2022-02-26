import { FormEvent, ChangeEvent, useState } from "react"
import { Button, Dialog, TextField, DialogContent, DialogActions, IconButton, DialogTitle } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"

import { useDialog } from "src/providers/dialog"
import { sendEmail } from "src/helpers/request"
import { handleError } from "src/helpers/errors"
import { formatName } from "src/helpers/user"

import { User } from "src/types/model"

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

interface Props {
  show: boolean
  user: User
  handleClose: () => void
  title: string
  dialogContent: string | null
  emailAddress: string
  emailSubject: string
}

const SendEmail = ({ show, handleClose, user, title, dialogContent, emailAddress, emailSubject }: Props) => {
  const { openDialog } = useDialog()
  const [comment, setComment] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setComment(target.value)
  }

  const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    try {
      const content = [
        `Nom et prénom : ${formatName(user)}`,
        `Mail : ${user.email} `,
        `Téléphone : ${user.telephone} `,
        `Code-barres: ${user.codeBarre}`,
        `Commentaire : ${comment}`,
      ]

      await sendEmail(emailAddress, emailSubject, content.join("<br />"))

      handleClose()
      openDialog(`Un e-mail a été envoyé a ${emailAddress} qui te recontactera si besoin.`)
    } catch (error) {
      handleError(error as Error)
    }

    setLoading(false)
  }

  return (
    <Dialog open={show} onClose={handleClose} title={title}>
      <form onSubmit={handleSendEmail} autoComplete="off">
        <CloseButton onClick={handleClose}>
          <Close />
        </CloseButton>
        <Title>{title}</Title>
        <DialogContent>
          {dialogContent && <div>{dialogContent}</div>}
          <TextInput
            name="comment"
            multiline
            required={false}
            label="Commentaire"
            value={comment}
            onChange={handleInputChange}
          ></TextInput>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary" variant="contained" disabled={loading}>
            Confirmer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default SendEmail
