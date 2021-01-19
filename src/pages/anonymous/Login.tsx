import { FormEvent, useState } from "react"
import { Container, TextField, Button } from "@material-ui/core"

import { post } from "src/helpers/request"
import { User, useUser } from "src/providers/user"

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useUser()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = new FormData(event.currentTarget)
    setLoading(true)
    try {
      const data = await post("login_api", body)
      const user: User = {
        email: body.get("username") as string,
        token: data.token,
      }
      login(user)
    } catch (error) {
      alert(error)
      setLoading(false)
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
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
