import type { Statut } from "src/types/model"

import { useEffect, useState } from "react"
import { Phone, MailOutline } from "@material-ui/icons"
import { Button, Grid, Hidden, Input } from "@material-ui/core"
import styled from "@emotion/styled/macro"

import { useUser } from "src/providers/user"
import { handleError } from "src/helpers/errors"
import apollo from "src/helpers/apollo"
import { USER_UPDATE } from "src/graphql/queries"
import { useDialog } from "src/providers/dialog"

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
  const { openDialog } = useDialog()
  const status = user?.statuts.find((s: Statut) => s.actif)?.libelle.toLowerCase()
  const roles = user?.rolesChouette || []

  const [email, setEmail] = useState<string>(user?.email || "")
  const [telephone, setTelephone] = useState<string>(user?.telephone || "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setEmail(user?.email || "")
    setTelephone(user?.telephone || "")
  }, [user])

  function handleInputChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = target

    switch (name) {
      case "email":
        setEmail(value)
        break

      case "telephone":
        setTelephone(value)
        break
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await apollo.mutate({
        mutation: USER_UPDATE,
        variables: { idUser: user?.id, email: email, telephone: telephone },
      })
      openDialog("Vos informations ont bien été mises à jour")
    } catch (error) {
      handleError(error)
    }
    setLoading(false)
  }

  return (
    <ProfileContainer>
      <form>
        <Grid container>
          <Title>
            {user?.prenom} {user?.nom}
          </Title>
          <Grid item xs={12}>
            <InfoUser>Je suis {status}</InfoUser>
          </Grid>
          <Grid item xs={12}>
            <InfoUser>Et j’ai comme formations {roles.map((r) => r.libelle).join(", ")}</InfoUser>
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
            <Button color="primary" variant="contained" onClick={handleSave} disabled={loading}>
              Enregistrer
            </Button>
          </ButtonArea>
        </Grid>
      </form>
    </ProfileContainer>
  )
}

export default ProfilePage
