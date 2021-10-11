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

const ITEMS_ABSENCE_REASON = [
  { title: "Je ne pourrai pas assurer ma PIAF", id: "noPiaf" },
  { title: " Je ne pourrai pas assurer ma PIAF ni effectuer mes courses", id: "noBuy" },
  { title: " Autres (spécifier en comentaire)", id: "other" },
]

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
      `Raison de l'absence : ${values.reasonAbsence} <br /> Période : ${values.dateIni} au ${
        values.dateFin
      } <br /> Autre information : ${values.otherInfo != "" ? values.otherInfo : "[RAS]"}.`
    )
    handleClose()

    openDialog("Un e-mail informatif a été envoyé au BdM. Votre absence sera bientôt validée.")
  }

  const commentRequired = () => {
    const itemFound = ITEMS_ABSENCE_REASON.filter((i) => i.id == "other")
    if (itemFound.length > 0) return values.reasonAbsence == itemFound[0].title
    else return true
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
                required
                onChange={handleReasonChange}
              >
                {ITEMS_ABSENCE_REASON.map(({ id, title }) => {
                  return (
                    <MenuItem id={id} value={title} key={id}>
                      {title}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Row>
          <Row>
            <TextInput
              name="otherInfo"
              multiline
              required={commentRequired()}
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
