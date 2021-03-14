import { useUser } from "src/providers/user"

import { Phone, MailOutline } from "@material-ui/icons"
import { Button, Grid, Hidden, Input } from "@material-ui/core"
import styled from "@emotion/styled/macro"
import { useEffect, useState } from "react"
import { handleError } from "src/helpers/errors"
import apollo from "src/helpers/apollo"
import { USER_UPDATE } from "src/graphql/queries"
import InfoDialog from "src/components/InfoDialog"
import { Statut } from "src/types/model"

const Title = styled.h3`
  text-align: left;
  margin-top: 0;
`
const InfoUser = styled.h4`
  text-align: left;
  margin-top: 0;
  color: gray;
`
const ProfileContainer = styled.div`
  margin: 0 auto;
  max-width: 500px;
`

const ButtonArea = styled.div`
  margin: 15px auto;
`

const ProfilePage = () => {
  const { user } = useUser<true>()
  const status = user?.statuts.find((s: Statut) => s.actif)?.libelle.toLowerCase()
  const roles = user?.rolesChouette || []

  const [email, setEmail] = useState<string>(user?.email || "")
  const [telephone, setTelephone] = useState<string>(user?.telephone || "")
  const [openDialog, setOpenDialog] = useState(false)
  const [infoMessage, setInfoMessage] = useState("")

  useEffect(() => {
    setEmail(user?.email || "")
    setTelephone(user?.telephone || "")
  }, [user])

  const handleOpenDialog = (_infoMessage: string) => {
    setInfoMessage(_infoMessage)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const name = e.target.name

    switch (name) {
      case "email":
        setEmail(value)
        break

      case "telephone":
        setTelephone(value)
        break
    }
  }

  function handleSave() {
    apollo
      .mutate({
        mutation: USER_UPDATE,
        variables: { idUser: user?.id, email: email, telephone: telephone },
      })
      .then((response) => {
        console.log(response)
        handleOpenDialog("Les nouveaux données de l’utilisateur ont bien été enregistrés")
      })
      .catch(handleError)
  }

  return (
    <ProfileContainer>
      <form>
        <Grid container>
          <Title>
            {user?.prenom} {user?.nom}
          </Title>
          <Grid item xs={12}>
            <InfoUser> Je suis {status}</InfoUser>
          </Grid>
          <Grid item xs={12}>
            <InfoUser> Et j´ai formation comme {roles.map((r) => r.libelle).join(", ")} </InfoUser>
          </Grid>
          <Grid item xs={1}>
            <Phone />
          </Grid>
          <Grid item xs={3}>
            <Hidden xsDown>Téléphone</Hidden>
          </Grid>
          <Grid item xs={8}>
            <Input name="telephone" required value={telephone} fullWidth onChange={handleInputChange} />
          </Grid>
          <Grid item xs={1}>
            <MailOutline />
          </Grid>
          <Grid item xs={3}>
            <Hidden xsDown>Mail</Hidden>
          </Grid>
          <Grid item xs={8}>
            <Input name="email" required value={email} fullWidth onChange={handleInputChange} />
          </Grid>
          <ButtonArea>
            <Button color="primary" variant="contained" onClick={handleSave}>
              Enregistrer
            </Button>
          </ButtonArea>
        </Grid>
        <InfoDialog open={openDialog} handleClose={handleCloseDialog} title="" message={infoMessage}></InfoDialog>
      </form>
    </ProfileContainer>
  )
}

export default ProfilePage
