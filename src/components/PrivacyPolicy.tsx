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
          Tu n’as pas autorisé l’accès à tes coordonnées (email et numéro de téléphone) par les autres
          coopérateurs•rices. Les afficher facilite la communication (par example en cas d’indisponibilité au dernier
          moment), et facilite ainsi l’organisation des PIAF.{" "}
        </p>
        <p>
          Il est possible à tout moment de modifier ce choix depuis <Link to="/profile"> mon profil</Link>
        </p>
      </DialogContent>

      <Button onClick={handleAccept} color="primary">
        J’accepte que mes coordonnées soient visibles par les autres coopérateurs·rices
      </Button>
      <Button onClick={handleClose} color="primary">
        Je décide plus tard
      </Button>
      <Button onClick={handleDismiss} color="primary">
        Je ne veux pas afficher mes coordonées
      </Button>
    </Dialog>
  )
}

export default PrivacyPolicy
