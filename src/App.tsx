import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"

import { useUser } from "src/providers/user"

import Anonymous from "src/pages/anonymous"
import Authenticated from "src/pages/authenticated"
import { DialogProvider } from "src/providers/dialog"

const App = () => {
  const { auth } = useUser()

  useEffect(() => {
    const ok = window.confirm(`Tu es sur le point d'accéder au nouvel outil de participation.
Si tu souhaites t'inscrire pour une PIAF à partir du 29 novembre, tu es sur la bonne voie, clique sur OK pour accéder à l'outil !
Si tu souhaites t'inscrire pour une PIAF avant le 29 novembre, il faut pour le moment continuer à utiliser le planning historique : clique sur Annuler pour être redirigé·e vers ce planning !`)

    if (!ok) {
      window.location.href = "https://espace-membres.lachouettecoop.fr/page/tafs"
    }
  }, [])

  return (
    <BrowserRouter>
      <DialogProvider>{auth ? <Authenticated /> : <Anonymous />}</DialogProvider>
    </BrowserRouter>
  )
}

export default App
