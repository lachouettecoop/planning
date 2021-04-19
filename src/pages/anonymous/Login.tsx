import { FormEvent, useState } from "react"
import { Container, TextField, Button } from "@material-ui/core"
import styled from "@emotion/styled/macro"

import { useUser, Auth } from "src/providers/user"
import { post } from "src/helpers/request"
import { handleError } from "src/helpers/errors"

import { ReactComponent as Logo } from "src/images/logo_white.svg"

const Header = styled.div`
  text-align: center;
  svg {
    width: 250px;
    height: 250px;
    margin: -20px 0 -40px;
  }
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
      handleError(error)
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Header>
        <Logo />
        <h1>Planning</h1>
      </Header>
      <form onSubmit={handleSubmit}>
        <p>
          Cette application permet de gérer le planning des PIAFs du magasin. Connectez-vous avec vos identifiants
          habituels.
        </p>
        <TextField type="email" name="username" label="E-mail" fullWidth variant="outlined" margin="normal" />
        <TextField type="password" name="password" label="Mot de passe" fullWidth variant="outlined" margin="normal" />
        <Button type="submit" fullWidth size="large" variant="contained" color="primary" disabled={loading}>
          Connexion
        </Button>
      </form>
    </Container>
  )
}

export default LoginPage
