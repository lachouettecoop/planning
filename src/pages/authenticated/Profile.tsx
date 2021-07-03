import { useEffect, useState } from "react"
import { Phone, Mail } from "@material-ui/icons"
import { Button, InputAdornment, TextField, Typography } from "@material-ui/core"
import styled from "@emotion/styled/macro"

import Loader from "src/components/Loader"
import LongAbsence from "src/components/LongAbsence"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import { USER_UPDATE } from "src/graphql/queriesUser"
import { useDialog } from "src/providers/dialog"
import { handleError } from "src/helpers/errors"
import { formatRoles } from "src/helpers/role"

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

const ProfilePage = () => {
  const { user } = useUser<true>()
  const [saving, setSaving] = useState(false)
  const { openDialog } = useDialog()
  const [openAbsenceDialog, setOpenAbsenceDialog] = useState(false)
  const [values, setValues] = useState({
    email: user?.email || "",
    telephone: user?.telephone || "",
  })

  useEffect(() => {
    if (user) {
      setValues({
        email: user.email,
        telephone: user.telephone,
      })
    }
  }, [user])

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      await apollo.mutate({
        mutation: USER_UPDATE,
        variables: { ...values, idUser: user?.id },
      })
      openDialog("Vos informations ont bien été mises à jour")
    } catch (error) {
      handleError(error)
    }
    setSaving(false)
  }

  const handleOpenAbsenceDialog = () => {
    setOpenAbsenceDialog(true)
  }

  const handleCloseAbsenceDialog = () => {
    setOpenAbsenceDialog(false)
  }

  if (!user) {
    return (
      <Loading>
        <Loader />
      </Loading>
    )
  }

  return (
    <Container>
      <form onSubmit={handleSave}>
        <Typography variant="h2">
          {user.prenom} {user.nom}
        </Typography>
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
        <Button color="primary" variant="contained" disabled={saving} type="submit">
          Enregistrer
        </Button>
        <Button color="primary" variant="contained" disabled={saving} onClick={handleOpenAbsenceDialog}>
          Informer d’une absence prolongée
        </Button>
      </form>
      <LongAbsence show={openAbsenceDialog} handleClose={handleCloseAbsenceDialog} />
    </Container>
  )
}

export default ProfilePage
