import React, { ChangeEvent, useState } from "react"
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
    otherInfo: "",
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

  const handleReasonChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    let { name } = event.target
    if (!name) name = ""

    setValues({
      ...values,
      [name]: event.target.value,
    })
  }

  const handleSendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!process.env.REACT_APP_MAIL_BDM) {
      alert("L’adresse e-mail du BdM n’est pas configurée. Contactez votre administrateur.")
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
      `Bonjour, ${values.reasonAbsence} à La Chouette Coop du ${values.dateIni} au ${values.dateFin} en raison de ${values.otherInfo}.`
    )
    handleClose()

    openDialog("Un e-mail informatif a été envoyé au BdM. Votre absence sera bientôt validée.")
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
            <FormControl fullWidth>
              <InputLabel>Type de changement</InputLabel>
              <Select
                value={values.reasonAbsence}
                label="Type de changement"
                name="reasonAbsence"
                onChange={handleReasonChange}
              >
                <MenuItem id="NoPiaf" value={"Je ne pourrai pas assurer ma PIAF"}>
                  Je ne pourrai pas assurer ma PIAF
                </MenuItem>
                <MenuItem id="NoBuy" value={"Je ne pourrais pas assurer ma PIAF ni effectuer mes courses"}>
                  Je ne pourrai pas assurer ma PIAF ni effectuer mes courses
                </MenuItem>
                <MenuItem id="Other" value={"Autres (especifier en comentaire)"}>
                  Autres (spécifier en comentaire)
                </MenuItem>
              </Select>
            </FormControl>
          </Row>
          <Row>
            <TextInput
              name="other"
              multiline
              required
              label="Commentaire aditionel"
              value={values.otherInfo}
              onChange={handleInputChange}
            ></TextInput>
          </Row>
          <Row>
            <span>
              Pour plus d’informations il est possible de consulter le manuel du•de la coopérateur•ice{" "}
              <a href="https://espace-membres.lachouettecoop.fr/page/les-documents">ici</a>
            </span>
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
