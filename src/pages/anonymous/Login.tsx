import { FormEvent, useState } from "react"
import { Container, TextField, Button, Typography, IconButton, Tooltip } from "@mui/material"
import styled from "@emotion/styled/macro"
import { VisibilityOff, Visibility } from "@mui/icons-material"

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
const ConexionButton = styled(Button)`
  margin-bottom: 15px;
`

const ResetPassword = styled.div`
  margin: 5px;
  float: right;
`

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
        handleError(error as Error)
      }
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Container maxWidth="xs">
      <Header>
        <Logo />
        <Typography variant="h1">Planning</Typography>
      </Header>
      <form onSubmit={handleSubmit}>
        <p>
          Pour te connecter, l’identifiant et le mot de passe sont les mêmes que ceux que tu utilises pour aller sur
          l’espace membres. Si tu réinitialises ton mot de passe, le changement sera donc valable aussi pour l’espace
          membres.
        </p>
        <TextField type="email" name="username" label="E-mail" fullWidth variant="outlined" margin="normal" />
        <TextField
          type={showPassword ? "text" : "password"}
          name="password"
          label="Mot de passe"
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <Tooltip title={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}>
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
            ),
          }}
        />
        <ResetPassword>
          <a href="https://adminchouettos.lachouettecoop.fr/resetting/request">Mot de passe oublié ?</a>
        </ResetPassword>
        <ConexionButton type="submit" fullWidth size="large" variant="contained" color="primary" disabled={loading}>
          Connexion
        </ConexionButton>
      </form>
    </Container>
  )
}

export default LoginPage
