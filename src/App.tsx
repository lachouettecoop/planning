import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"

import { useUser } from "src/providers/user"

import Anonymous from "src/pages/anonymous"
import Authenticated from "src/pages/authenticated"
import { DialogProvider } from "src/providers/dialog"

const App = () => {
  const { auth } = useUser()

  useEffect(() => {
    const redirect = window.confirm(`ATTENTION ! Cet outil n'est pas encore le planning officiel de La Chouette Coop !
Il s'agit pour l'instant d'une version de développement, avec des données de test.
Cliquez sur OK pour être redirigé·e vers la page de l'espace membre sur laquelle se trouve le lien vers le planning actuel.`)

    if (redirect) {
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
