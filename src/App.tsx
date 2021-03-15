import { BrowserRouter } from "react-router-dom"

import { useUser } from "src/providers/user"

import Anonymous from "src/pages/anonymous"
import Authenticated from "src/pages/authenticated"
import { DialogProvider } from "src/providers/dialog"

const App = () => {
  const { auth } = useUser()

  return (
    <BrowserRouter>
      <DialogProvider>{auth ? <Authenticated /> : <Anonymous />}</DialogProvider>
    </BrowserRouter>
  )
}

export default App
