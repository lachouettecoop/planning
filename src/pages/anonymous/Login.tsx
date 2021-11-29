import { FormEvent, useState } from "react"
import { Container, TextField, Button, Typography } from "@material-ui/core"
import styled from "@emotion/styled/macro"

import { useUser, Auth } from "src/providers/user"
import { post } from "src/helpers/request"
import { handleError } from "src/helpers/errors"

import { ReactComponent as Logo } from "src/images/logo_white.svg"
import HttpError from "standard-http-error"

const Header = styled.div`
  text-align: center;
  svg {
    width: 250px;
    height: 250px;
    margin: -20px 0;
  }
`

const ResetPassword = styled.div`
  margin: 5px;
  float: right;
`

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useUser()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = new FormData(event.currentTarget)
    setLoading(true)
    try {
      const data = await post("login_api", body)
      const auth: Auth = {
        id: data.userId,
        email: body.get("username") as string,
        token: data.token,
      }
      login(auth)
    } catch (error) {
      if (error instanceof HttpError && error.code === 401) {
        alert("Identifiant ou mot de passe incorrect")
      } else {
        handleError(error)
      }
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Header>
        <Logo />
        <Typography variant="h1">Planning</Typography>
      </Header>
      <form onSubmit={handleSubmit}>
        <p>
          Cette application permet de gérer le planning des PIAF du magasin. Connecte-toi avec tes identifiants
          habituels.
        </p>
        <TextField type="email" name="username" label="E-mail" fullWidth variant="outlined" margin="normal" />
        <TextField type="password" name="password" label="Mot de passe" fullWidth variant="outlined" margin="normal" />
        <ResetPassword>
          <a href="https://adminchouettos.lachouettecoop.fr/resetting/request">Mot de passe oublié ?</a>
        </ResetPassword>
        <Button type="submit" fullWidth size="large" variant="contained" color="primary" disabled={loading}>
          Connexion
        </Button>
      </form>
    </Container>
  )
}

export default LoginPage
