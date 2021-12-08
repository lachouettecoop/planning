import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Dialog, DialogContent, Button } from "@material-ui/core"

import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import { USER_UPDATE } from "src/graphql/queriesUser"
import { handleError } from "src/helpers/errors"

const PrivacyPolicy = () => {
  const [open, setOpen] = useState(false)
  const { user, refetchUser } = useUser<true>()

  useEffect(() => {
    if (!user?.affichageDonneesPersonnelles) {
      const dismissed = localStorage.getItem("privacy_police_dismissed")
      if (!dismissed) {
        setOpen(true)
      }
    }
  }, [user?.affichageDonneesPersonnelles])

  const handleClose = () => {
    setOpen(false)
  }

  const handleDismiss = () => {
    setOpen(false)
    localStorage.setItem("privacy_police_dismissed", "true")
  }

  const handleAccept = async () => {
    setOpen(false)
    try {
      await apollo.mutate({
        mutation: USER_UPDATE,
        variables: { affichageDonneesPersonnelles: true, idUser: user?.id },
      })
      refetchUser()
    } catch (error) {
      handleError(error as Error)
    }
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogContent>
        <p>
          {" "}
          Par défaut, tes coordonnées (email et numéro de téléphone) ne sont pas visibles par les autres
          coopérateurs·rices. Les rendre accessibles facilite la communication entre coopérateurs·rices et optimise
          l’organisation des PIAF au magasin, par exemple en cas d’indisponibilité au dernier moment.{" "}
        </p>
        <p>
          Ce choix est modifiable à tout moment depuis <Link to="/profile"> mon profil</Link>
        </p>
      </DialogContent>

      <Button onClick={handleAccept} color="primary">
        Je comprends et j’accepte que mes coordonnées soient visibles par tous·tes les coopérateurs·rices
      </Button>
      <Button onClick={handleClose} color="primary">
        Je décide plus tard
      </Button>
      <Button onClick={handleDismiss} color="primary">
        Je n’accepte pas que mes coordonnées soient visibles
      </Button>
    </Dialog>
  )
}

export default PrivacyPolicy
