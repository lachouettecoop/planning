import { Button, Dialog, TextField, DialogContent, DialogActions } from "@material-ui/core"
import styled from "@emotion/styled/macro"

import React, { useState } from "react"

import { sendEmail } from "src/helpers/request"
import { useDialog } from "src/providers/dialog"

const Row = styled.div`
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

interface Props {
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
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

  const TEXT_MAIL = `Bonjour, je ne pourrais assurer une activité régulière à La Chouette Coop du ${values.dateIni}  au  ${values.dateFin}  en  raison  de ${values.reasonAbsence}. `

  const handleSendEmail = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!process.env.MAIL_BDM) {
      alert("Le mail du BdM n’est pas configuré. Contactez avec votre Admin IT")
      return
    }

    sendEmail(process.env.MAIL_BDM, "Absence prolongée", TEXT_MAIL)
    handleClose(event)
    openDialog("Un mail informatif a été envoyé au BdM. Votre absence sera bientôt validée.")
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={submit} autoComplete="off">
      <Dialog open={show} onClose={handleClose}>
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
            <TextField
              name="reasonAbsence"
              multiline
              required
              label="Motif de l’absence"
              value={values.reasonAbsence}
              onChange={handleInputChange}
            ></TextField>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary" variant="contained" onClick={handleSendEmail}>
            Confirmer au BdM
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default LongAbsence
