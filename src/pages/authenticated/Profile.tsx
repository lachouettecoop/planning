import { ChangeEvent, useEffect, useState } from "react"
import { Prompt } from "react-router"
import { Phone, Mail } from "@material-ui/icons"
import {
  Button,
  InputAdornment,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
} from "@material-ui/core"
import styled from "@emotion/styled/macro"

import Loader from "src/components/Loader"
import LongAbsence from "src/components/LongAbsence"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import { USER_UPDATE } from "src/graphql/queriesUser"
import { useDialog } from "src/providers/dialog"
import { handleError } from "src/helpers/errors"
import { formatRoles } from "src/helpers/role"
import { formatName } from "src/helpers/user"

const Loading = styled.div`
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Container = styled.div`
  margin: 0 auto;
  max-width: 500px;
  p,
  .MuiTextField-root {
    margin: 10px 0;
  }
  button {
    margin: 15px auto;
    display: block;
  }
`

const UserDataShare = styled(FormControl)`
  margin: 10px 0;
`

const ProfilePage = () => {
  const { user, refetchUser } = useUser<true>()
  const [saving, setSaving] = useState(false)
  const { openDialog } = useDialog()
  const [openAbsenceDialog, setOpenAbsenceDialog] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [values, setValues] = useState({
    email: user?.email || "",
    telephone: user?.telephone || "",
    affichageDonneesPersonnelles: user?.affichageDonneesPersonnelles,
  })

  useEffect(() => {
    if (user) {
      setValues({
        email: user.email,
        telephone: user.telephone,
        affichageDonneesPersonnelles: user.affichageDonneesPersonnelles,
      })
    }
  }, [user])

  useEffect(() => {
    const alertUser = (e: any) => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", alertUser)
    return () => {
      window.removeEventListener("beforeunload", alertUser)
    }
  }, [unsavedChanges])

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target
    setValues({
      ...values,
      [name]: value,
    })
    setUnsavedChanges(true)
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      await apollo.mutate({
        mutation: USER_UPDATE,
        variables: { ...values, idUser: user?.id },
      })
      refetchUser()
      openDialog("Tes informations ont bien été mises à jour")
    } catch (error) {
      handleError(error as Error)
    }
    setUnsavedChanges(false)
    setSaving(false)
  }

  const handleOpenAbsenceDialog = () => {
    setOpenAbsenceDialog(true)
  }

  const handleCloseAbsenceDialog = () => {
    setOpenAbsenceDialog(false)
  }

  const handleDisplayContactDetails = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      affichageDonneesPersonnelles: event.target.value.toLowerCase() == "true", //Convert to bool
    })
    setUnsavedChanges(true)
  }

  if (!user) {
    return (
      <Loading>
        <Loader />
      </Loading>
    )
  }

  return (
    <>
      <Prompt
        when={unsavedChanges}
        message="Les changements n'ont pas été enregistrés, es-tu sûr·e de vouloir abandonner la page?"
      />
      <Container>
        <form onSubmit={handleSave}>
          <Typography variant="h2">{formatName(user)}</Typography>
          <p>{formatRoles(user.rolesChouette)}</p>
          <TextField
            name="telephone"
            label="Téléphone"
            required
            disabled={!user}
            value={values.telephone}
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="email"
            label="Adresse e-mail"
            required
            disabled={!user}
            value={values.email}
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail />
                </InputAdornment>
              ),
            }}
          />
          <UserDataShare>
            <p>
              {" "}
              L’accès à mes coordonnées (email et numéro de téléphone) par tous les coopérateurs·rices facilite la
              communication entre coopérateurs·rices et optimise l’organisation des PIAF au magasin, par exemple en cas
              d’indisponibilité au dernier moment.
            </p>
            <p>Je peux modifier ce choix à tout moment.</p>
            <RadioGroup
              aria-label="displayMyContactDetails"
              defaultValue="false"
              name="radio-buttons-group"
              value={values.affichageDonneesPersonnelles ? "true" : "false"}
              onChange={handleDisplayContactDetails}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Je comprends et j’accepte que mes coordonnées soient visibles par tous·tes les coopérateurs·rices"
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Je n’accepte pas que mes coordonnées soient visibles"
              />
            </RadioGroup>
          </UserDataShare>
          <Button color="primary" variant="contained" disabled={saving} type="submit">
            Enregistrer
          </Button>
          <Button color="primary" disabled={saving} onClick={handleOpenAbsenceDialog}>
            Tu ne peux pas faire des PIAF pendant au moins 2 mois, c’est par ici!
          </Button>
        </form>
        <LongAbsence show={openAbsenceDialog} handleClose={handleCloseAbsenceDialog} user={user} />
      </Container>
    </>
  )
}

export default ProfilePage
