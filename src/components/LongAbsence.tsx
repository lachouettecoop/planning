import React, { useState } from "react"
import { Button, Dialog, TextField, DialogContent, DialogActions, IconButton, DialogTitle } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"

import { sendEmail } from "src/helpers/request"
import { useDialog } from "src/providers/dialog"

const Row = styled.div`
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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
  margin-right: 30px;
`

interface Props {
  show: boolean
  handleClose: () => void
}

const LongAbsence = ({ show, handleClose }: Props) => {
  const { openDialog } = useDialog()
  const [values, setValues] = useState({
    reasonAbsence: "",
    dateIni: new Date(),
    dateFin: new Date(),
  })

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleSendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!process.env.REACT_APP_MAIL_BDM) {
      alert("L’adresse  e-mail du BdM n’est pas configurée. Contactez votre administrateur.")
      return
    }

    if (!values.dateIni || !values.dateFin || !values.reasonAbsence) {
      openDialog("Tous les champs sont obligatoires.")
      return
    }
    if (values.dateIni > values.dateFin) {
      openDialog("La date de début ne peut pas être postérieure à la date de fin.")
      return
    }

    await sendEmail(
      process.env.REACT_APP_MAIL_BDM,
      "Absence prolongée",
      `Bonjour, je ne pourrai pas assurer une activité régulière à La Chouette Coop du ${values.dateIni} au ${values.dateFin} en raison de ${values.reasonAbsence}.`
    )
    handleClose()

    openDialog("Un mail informatif a été envoyé au BdM. Votre absence sera bientôt validée.")
  }

  return (
    <Dialog open={show} onClose={handleClose}>
      <form onSubmit={handleSendEmail} autoComplete="off">
        <CloseButton onClick={handleClose}>
          <Close />
        </CloseButton>
        <Title>Informer d’une absence prolongée</Title>
        <DialogContent>
          <Row>
            <TextField
              id="dateIni"
              label="Date debut"
              name="dateIni"
              type="date"
              required
              value={values.dateIni}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Row>
          <Row>
            <TextField
              id="dateFin"
              label="Date fin"
              name="dateFin"
              type="date"
              required
              value={values.dateFin}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Row>
          <Row>
            <TextInput
              name="reasonAbsence"
              multiline
              required
              label="Motif de l’absence"
              value={values.reasonAbsence}
              onChange={handleInputChange}
            ></TextInput>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary" variant="contained">
            Confirmer au BdM
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default LongAbsence
