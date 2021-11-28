import { BrowserRouter } from "react-router-dom"

import { useUser } from "src/providers/user"
import { DialogProvider } from "src/providers/dialog"

import Anonymous from "src/pages/anonymous"
import Authenticated from "src/pages/authenticated"

const App = () => {
  const { auth } = useUser()

  return (
    <BrowserRouter>
      <DialogProvider>{auth ? <Authenticated /> : <Anonymous />}</DialogProvider>
    </BrowserRouter>
  )
}

export default App
